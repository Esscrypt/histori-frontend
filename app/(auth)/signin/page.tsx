export const metadata = {
  title: 'Sign In - Histori',
  description: 'Sign in to Histori',
}

import Logo from '@/components/ui/logo'
import CustomerAvatar from '@/public/images/customer-avatar-05.jpg'
import LoginForm from '@/components/forms/auth-forms/login/LoginForm'

export default function SignIn() {
  return (
    <>
      {/* Content */}
      <div className="w-full md:w-1/2">

        <div className="min-h-screen h-full flex flex-col justify-center">

          <div className="px-5 sm:px-6 py-8">
            <div className="w-full max-w-md mx-auto">

              {/* Site branding */}
              <div className="mb-6">
                <Logo />
              </div>

              <h1 className="h2 font-playfair-display text-slate-800 mb-12">Sign in to Histori</h1>

              {/* Social login */}
              {/* <SocialLogin /> */}

              {/* Divider */}
              {/* <div className="flex items-center my-6">
                <div className="border-t border-slate-200 grow mr-3" aria-hidden="true"></div>
                <div className="text-sm text-slate-500 italic">or</div>
                <div className="border-t border-slate-200 grow ml-3" aria-hidden="true"></div>
              </div> */}

              {/* Form */}
              <LoginForm />

            </div>
          </div>

        </div>

      </div>

      {/* Right side */}
      <div className="relative hidden md:block md:w-1/2 bg-slate-900" aria-hidden="true">

        {/* Bg image */}
        <div className="absolute inset-0" data-aos="fade">
          <img className="opacity-10 w-full h-full object-cover" src="/images/background.webp" width={760} height={900} alt="Background" />
        </div> 

        {/* Motivational Quote */}
        <div className="min-h-screen h-full flex flex-col justify-center">
          <div className="px-5 sm:px-6">
            <div className="w-full max-w-lg mx-auto">
              <h2 className="h3 md:text-4xl font-playfair-display text-slate-100 mb-4">Histori</h2>
              <div className="space-y-3">
                <svg className="fill-blue-600" width="20" height="16" viewBox="0 0 20 16">
                  <path d="M2.76 16c2.577 0 5.154-3.219 5.154-5.996 0-1.357-.613-2.272-1.748-2.272s-2.27.726-3.283 1.64C3.16 6.439 5.613 3.346 9.571.885L9.233 0C3.466 2.903 0 7.732 0 12.213 0 14.517.828 16 2.76 16Zm10.43 0c2.577 0 5.154-3.219 5.154-5.996 0-1.357-.614-2.272-1.749-2.272-1.135 0-2.27.726-3.282 1.64.276-2.934 2.73-6.027 6.687-8.488L19.663 0c-5.767 2.903-9.234 7.732-9.234 12.213 0 2.304.829 3.787 2.761 3.787Z" />
                </svg>
                <blockquote className="text-slate-400 italic">
                  "People don’t buy what you do; they buy *why* you do it. At Histori, we believe that access to data is the key to shaping the future. By empowering you with fast, scalable, and secure historical blockchain data, we help you turn the unknown into an opportunity."
                </blockquote>
              </div>
              <div className="flex items-center mt-4">
                <div className="font-medium">
                  <span className="text-slate-200">Mihail Kirov</span>
                  <span className="text-slate-600"> · </span>
                  <span className="text-slate-500">Founder, Histori</span>
                </div>
              </div>
              <div className="mt-8">
                <a href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Start your journey with Histori today
                </a>
              </div>
            </div>
          </div>
        </div>


      </div>    
    </>
  )
}
