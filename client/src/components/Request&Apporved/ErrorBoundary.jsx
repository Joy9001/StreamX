import { AlertTriangle, RefreshCw } from 'lucide-react'
import PropTypes from 'prop-types'
import { Component } from 'react'

class ErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    console.error('Request & Approval section error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex h-64 items-center justify-center p-6'>
          <div className='w-full max-w-md rounded-lg border border-red-100 bg-red-50 p-6 text-center shadow-sm'>
            <div className='mb-4 flex justify-center'>
              <div className='rounded-full bg-red-100 p-3'>
                <AlertTriangle className='h-8 w-8 text-red-600' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-800'>
              Something went wrong
            </h3>
            <p className='mb-4 text-sm text-gray-600'>
              There was an error loading this section. Please try refreshing the
              page.
            </p>
            <div className='text-center'>
              <button
                onClick={this.handleReset}
                className='inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                <RefreshCw className='mr-2 h-4 w-4' />
                Try Again
              </button>
            </div>
            {import.meta.env.DEV && (
              <div className='mt-4 rounded border border-red-200 bg-white p-2 text-left'>
                <p className='mb-1 text-xs font-bold text-red-600'>
                  Error details (development only):
                </p>
                <pre className='overflow-auto text-xs text-gray-700'>
                  {this.state.error?.toString()}
                </pre>
              </div>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ErrorBoundary
