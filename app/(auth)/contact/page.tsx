export const metadata = {
    title: 'Contact US - Histori',
    description: 'Contact Form for Histori',
  }
  
  import Image from 'next/image'
//   import PageBg from '@/public/images/reset-password-bg.jpg'
  import ContactForm from '@/components/forms/auth-forms/contact-us/ContactForm'
  export default function Contact() {
    return (
      <>
        {/* Content */}
        <div className="w-full md:w-1/2">
  
          <div className="min-h-screen h-full flex flex-col justify-center">
  
            <div className="px-5 sm:px-6 py-8">
              <div className="w-full max-w-md mx-auto">
  
                {/* Site branding */}
                <div className="mb-6">
                  {/* Logo */}
               
                </div>
  
                <h1 className="h2 font-playfair-display text-slate-800 mb-12">Contact Us!</h1>
  
                {/* Form */}
                <ContactForm />
              </div>
            </div>
  
          </div>
  
        </div>
  
        {/* Right side */}
        <div className="relative hidden md:block md:w-1/2 bg-slate-900" aria-hidden="true">
  
          {/* Bg image */}
          {/* <div className="absolute inset-0" data-aos="fade">
            <Image className="opacity-10 w-full h-full object-cover" src={PageBg} width={760} height={900} priority alt="Background" />
          </div> */}
  
        </div>    
      </>
    )
  }
  