import { Wallet } from 'lucide-react'

function PaymentNav() {
  return (
    <div className='payment-nav navbar bg-base-100'>
      <div className='flex-1'>
        <span className='flex space-x-2'>
          <span className='payment-icon flex items-center justify-center'>
            <Wallet className='h-6 w-6' />
          </span>
          <span className='flex items-center justify-center text-xl font-bold'>
            Your Wallet
          </span>
        </span>
      </div>
      {/* Search functionality could be added here later if needed */}
    </div>
  )
}

export default PaymentNav