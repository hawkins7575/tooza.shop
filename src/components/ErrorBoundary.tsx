import React, { Component, ErrorInfo, ReactNode } from 'react'
import { theme } from '../styles/theme'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
  errorId?: string
  isRetrying: boolean
}

interface ErrorDetails {
  type: 'network' | 'auth' | 'render' | 'chunk' | 'unknown'
  severity: 'critical' | 'high' | 'medium' | 'low'
  userMessage: string
  actionMessage: string
  showRetry: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  private retryCount = 0
  private maxRetries = 3

  public state: State = {
    hasError: false,
    isRetrying: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      isRetrying: false
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorDetails = this.categorizeError(error)
    
    console.error('ErrorBoundary caught an error:', {
      errorId: this.state.errorId,
      error,
      errorInfo,
      category: errorDetails.type,
      severity: errorDetails.severity,
      componentStack: errorInfo.componentStack
    })

    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  private categorizeError(error: Error): ErrorDetails {
    const message = error.message.toLowerCase()
    const name = error.name.toLowerCase()
    
    if (message.includes('network') || message.includes('fetch')) {
      return {
        type: 'network',
        severity: 'medium',
        userMessage: '네트워크 연결에 문제가 있습니다',
        actionMessage: '인터넷 연결을 확인하고 다시 시도해주세요',
        showRetry: true
      }
    }
    
    if (message.includes('auth') || message.includes('unauthorized') || name.includes('auth')) {
      return {
        type: 'auth',
        severity: 'high',
        userMessage: '인증에 문제가 있습니다',
        actionMessage: '로그인을 다시 해주세요',
        showRetry: false
      }
    }
    
    if (message.includes('chunk') || message.includes('loading') || name.includes('chunk')) {
      return {
        type: 'chunk',
        severity: 'medium',
        userMessage: '페이지 로딩 중 오류가 발생했습니다',
        actionMessage: '페이지를 새로고침해주세요',
        showRetry: true
      }
    }
    
    if (name.includes('render') || message.includes('render')) {
      return {
        type: 'render',
        severity: 'high',
        userMessage: '화면 렌더링 중 오류가 발생했습니다',
        actionMessage: '페이지를 새로고침하거나 관리자에게 문의하세요',
        showRetry: true
      }
    }
    
    return {
      type: 'unknown',
      severity: 'critical',
      userMessage: '예상치 못한 오류가 발생했습니다',
      actionMessage: '페이지를 새로고침하거나 관리자에게 문의하세요',
      showRetry: true
    }
  }

  private handleRetry = async () => {
    if (this.retryCount >= this.maxRetries) return
    
    this.retryCount++
    this.setState({ isRetrying: true })
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    this.setState({
      hasError: false,
      error: undefined,
      errorId: undefined,
      isRetrying: false
    })
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const errorDetails = this.categorizeError(this.state.error)
      const canRetry = errorDetails.showRetry && this.retryCount < this.maxRetries

      return (
        <div 
          role="alert"
          style={{
            padding: theme.spacing[10],
            textAlign: 'center' as const,
            backgroundColor: theme.colors.error[50],
            border: `1px solid ${theme.colors.error[100]}`,
            borderRadius: theme.borderRadius.xl,
            margin: theme.spacing[5],
            maxWidth: '500px',
            marginLeft: 'auto',
            marginRight: 'auto',
            boxShadow: theme.shadows.lg
          }}
        >
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: theme.colors.error[500],
            borderRadius: theme.borderRadius.xl,
            margin: `0 auto ${theme.spacing[4]}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg 
              style={{width: '28px', height: '28px', color: theme.colors.neutral[0]}} 
              fill="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          
          <h2 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.neutral[900],
            marginBottom: theme.spacing[2]
          }}>
            {errorDetails.userMessage}
          </h2>
          
          <p style={{
            color: theme.colors.neutral[600],
            fontSize: theme.typography.fontSize.sm,
            marginBottom: theme.spacing[4],
            lineHeight: theme.typography.lineHeight.relaxed
          }}>
            {errorDetails.actionMessage}
          </p>

          {process.env.NODE_ENV === 'development' && (
            <details style={{
              marginBottom: theme.spacing[4],
              textAlign: 'left' as const,
              backgroundColor: theme.colors.neutral[50],
              padding: theme.spacing[3],
              borderRadius: theme.borderRadius.md,
              border: `1px solid ${theme.colors.neutral[200]}`
            }}>
              <summary style={{
                cursor: 'pointer',
                fontWeight: theme.typography.fontWeight.medium,
                marginBottom: theme.spacing[2],
                color: theme.colors.neutral[700]
              }}>
                개발자 정보 (Error ID: {this.state.errorId})
              </summary>
              <pre style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.neutral[600],
                whiteSpace: 'pre-wrap' as const,
                wordBreak: 'break-word' as const
              }}>
                {this.state.error.name}: {this.state.error.message}
                {this.state.error.stack && `\n\n${this.state.error.stack}`}
              </pre>
            </details>
          )}

          <div style={{
            display: 'flex',
            gap: theme.spacing[3],
            justifyContent: 'center',
            flexWrap: 'wrap' as const
          }}>
            {canRetry && (
              <button
                onClick={this.handleRetry}
                disabled={this.state.isRetrying}
                style={{
                  backgroundColor: this.state.isRetrying ? theme.colors.neutral[300] : theme.colors.primary[600],
                  color: theme.colors.neutral[0],
                  padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
                  borderRadius: theme.borderRadius.lg,
                  border: 'none',
                  cursor: this.state.isRetrying ? 'not-allowed' : 'pointer',
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing[2]
                }}
              >
                {this.state.isRetrying && (
                  <svg style={{width: '16px', height: '16px', animation: 'spin 1s linear infinite'}} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                )}
                {this.state.isRetrying ? '재시도 중...' : `다시 시도 (${this.maxRetries - this.retryCount}회 남음)`}
              </button>
            )}
            
            <button
              onClick={this.handleReload}
              style={{
                backgroundColor: theme.colors.neutral[600],
                color: theme.colors.neutral[0],
                padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
                borderRadius: theme.borderRadius.lg,
                border: 'none',
                cursor: 'pointer',
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium
              }}
            >
              페이지 새로고침
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}