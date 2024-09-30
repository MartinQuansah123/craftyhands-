import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import {getDoc, doc} from 'firebase/firestore';
import { auth, db } from '../firebase.config';
import { toast } from 'react-toastify';
import Link from 'next/link';

const UserSignin = () => {

    const router = useRouter()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [isModalOpen, setIsModalOpen] = useState(false);  // Modal visibility state
    const [resetEmail, setResetEmail] = useState('');  // Email input for reset password


    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
  
    const images = [
      'https://static.vecteezy.com/system/resources/previews/005/879/539/non_2x/cloud-computing-modern-flat-concept-for-web-banner-design-man-enters-password-and-login-to-access-cloud-storage-for-uploading-and-processing-files-illustration-with-isolated-people-scene-free-vector.jpg',
      'https://media.istockphoto.com/id/1281150061/vector/register-account-submit-access-login-password-username-internet-online-website-concept.jpg?s=612x612&w=0&k=20&c=9HWSuA9IaU4o-CK6fALBS5eaO1ubnsM08EOYwgbwGBo=',
      'https://www.1stop.ai/images/login-bg.png',
      'https://img.freepik.com/free-vector/sign-concept-illustration_114360-5425.jpg',
      'https://img.freepik.com/free-vector/privacy-policy-concept-illustration_114360-7853.jpg',
      'https://img.freepik.com/free-vector/sign-concept-illustration_114360-5425.jpg',
      'https://img.freepik.com/premium-vector/online-registration-sign-up-with-man-sitting-near-smartphone_268404-95.jpg',
      'https://t4.ftcdn.net/jpg/03/39/70/91/360_F_339709192_k6PWV7DqPCkhXBsmanByE5LTEwoJLstw.jpg',
      'https://t3.ftcdn.net/jpg/03/39/70/90/360_F_339709048_ZITR4wrVsOXCKdjHncdtabSNWpIhiaR7.jpg',
      'https://img.freepik.com/free-vector/computer-login-concept-illustration_114360-7962.jpg',
    ];
  
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            // Check if user exists in Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              // Redirect to the appropriate page based on user type
              let returnUrl;
              if (userData.accountType === "Super Admin") {
                returnUrl = `/my-admin/${user.uid}/dashboard`;
              } else if (userData.accountType === "Mini Admin") {
                returnUrl = `/dashboard/${user.uid}/dashboard`;
              } else if (userData.accountType === "Artisan") {
                returnUrl = `/account/${user.uid}/dashboard`;
              } else if (userData.accountType === "Client") {
                returnUrl = `/account/${user.uid}/dashboard`;
              } else {
                returnUrl = '/';
              }
              toast.warning("You are already signed in")
              router.push(returnUrl);
            }
          }
        });
    
        // Cleanup subscription on unmount
        return () => unsubscribe();
      }, [router]);

      /*
      const signIn = async (e) => {
        e.preventDefault();
    
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          // Fetch user data from Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Redirect to the appropriate page based on user type
            let returnUrl;
            if (userData.accountType === "Super Admin") {
                returnUrl = `/my-admin/${user.uid}/dashboard`;
              } else if (userData.accountType === "Mini Admin") {
                returnUrl = `/dashboard/${user.uid}/dashboard`;
              } else if (userData.accountType === "Employer") {
                returnUrl = `/account/${user.uid}/dashboard`;
              } else if (userData.accountType === "Employee") {
                returnUrl = `/account/${user.uid}/dashboard`;
              } else {
                returnUrl = '/';
              }
            toast.success('Signed in successfully');
            router.push(returnUrl);
          } else {
            toast.error('User data not found');
          }
        } catch (error) {
          toast.error('Failed to sign in: ' + error.message);
        }
      };
*/

const signIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (userDoc.exists()) {
            const userData = userDoc.data();

            if (userData.status === 'Verified') {
                let returnUrl;
                if (userData.accountType === "Super Admin") {
                    returnUrl = `/my-admin/${user.uid}/dashboard`;
                } else if (userData.accountType === "Mini Admin") {
                    returnUrl = `/dashboard/${user.uid}/dashboard`;
                } else if (userData.accountType === "Artisan") {
                    returnUrl = `/account/${user.uid}/dashboard`;
                } else if (userData.accountType === "Client") {
                    returnUrl = `/account/${user.uid}/dashboard`;
                } else {
                    returnUrl = '/';
                }
                toast.success('Signed in successfully');
                router.push(returnUrl);
            } else {
                toast.warning('Your account is under review');
                router.push('/checkpoint');
            }
        } else {
            toast.error('User data not found');
        }
    } catch (error) {
        toast.error('Failed to sign in: ' + error.message);
    } finally {
        setLoading(false);
    }
};

const handlePasswordReset = async () => {
  if (!resetEmail) {
      toast.error("Please enter your email");
      return;
  }

  try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast.success("Password reset email sent");
      setIsModalOpen(false);
  } catch (error) {
      toast.error("Error sending password reset email: " + error.message);
  }
};


  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 9000); // Change image every 5 seconds (adjust as needed)
  
      return () => clearInterval(interval);
    }, [images.length]);


  return (
    <div>
       
<div class="relative bg-gradient-to-bl from-blue-100 via-transparent dark:from-blue-950 dark:via-transparent">
  <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
    
    <div class="grid items-center md:grid-cols-2 gap-8 lg:gap-12">
      <div>
        <p class="inline-block text-sm font-medium bg-clip-text bg-gradient-to-l from-blue-600 to-violet-500 text-transparent dark:from-blue-400 dark:to-violet-400">
          Sign in today
        </p>

       
        <div class="mt-4 md:mb-12 max-w-2xl">
          <h1 class="mb-4 font-semibold text-gray-800 text-4xl lg:text-5xl dark:text-neutral-200">
          Your Gateway to Artisan and Client Services
          </h1>
          <p class="text-gray-600 dark:text-neutral-400">
          Effortlessly connect with our skilled artisans and manage your client interactions in one place. Log in to explore personalized features, 
          track project updates, and streamline your experience with comprehensive tools designed for your needs.
          </p>
        </div>
       
        <blockquote class="hidden md:block relative max-w-sm">
          <svg class="absolute top-0 start-0 transform -translate-x-6 -translate-y-8 size-16 text-gray-200 dark:text-neutral-800" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M7.39762 10.3C7.39762 11.0733 7.14888 11.7 6.6514 12.18C6.15392 12.6333 5.52552 12.86 4.76621 12.86C3.84979 12.86 3.09047 12.5533 2.48825 11.94C1.91222 11.3266 1.62421 10.4467 1.62421 9.29999C1.62421 8.07332 1.96459 6.87332 2.64535 5.69999C3.35231 4.49999 4.33418 3.55332 5.59098 2.85999L6.4943 4.25999C5.81354 4.73999 5.26369 5.27332 4.84476 5.85999C4.45201 6.44666 4.19017 7.12666 4.05926 7.89999C4.29491 7.79332 4.56983 7.73999 4.88403 7.73999C5.61716 7.73999 6.21938 7.97999 6.69067 8.45999C7.16197 8.93999 7.39762 9.55333 7.39762 10.3ZM14.6242 10.3C14.6242 11.0733 14.3755 11.7 13.878 12.18C13.3805 12.6333 12.7521 12.86 11.9928 12.86C11.0764 12.86 10.3171 12.5533 9.71484 11.94C9.13881 11.3266 8.85079 10.4467 8.85079 9.29999C8.85079 8.07332 9.19117 6.87332 9.87194 5.69999C10.5789 4.49999 11.5608 3.55332 12.8176 2.85999L13.7209 4.25999C13.0401 4.73999 12.4903 5.27332 12.0713 5.85999C11.6786 6.44666 11.4168 7.12666 11.2858 7.89999C11.5215 7.79332 11.7964 7.73999 12.1106 7.73999C12.8437 7.73999 13.446 7.97999 13.9173 8.45999C14.3886 8.93999 14.6242 9.55333 14.6242 10.3Z" fill="currentColor"/>
          </svg>

          <div class="relative z-10">
            <p class="text-xl italic text-gray-800 dark:text-white">
            CraftyHands is my go-to for finding extraordinary artisans. Their skill and creativity never cease to amaze.
            </p>
          </div>

          <footer class="mt-3">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <img class="size-8 rounded-full" src="https://upload.wikimedia.org/wikipedia/commons/9/94/Kwame_Twumasi_Ampofo.jpg" alt="Image Description"/>
              </div>
              <div class="grow ms-4">
                <div class="font-semibold text-gray-800 dark:text-neutral-200">Bismark Twumasi</div>
                <div class="text-xs text-gray-500 dark:text-neutral-500">Operations Director | AirCola</div>
              </div>
            </div>
          </footer>
        </blockquote>
        
      </div>
      

      <div>
        
        <form onSubmit={signIn}>
          <div class="lg:max-w-lg lg:mx-auto lg:me-0 ms-auto">
            
            <div class="p-4 sm:p-7 flex flex-col bg-white rounded-2xl shadow-lg dark:bg-neutral-900">
              <div class="text-center">
                <h1 class="block text-2xl font-bold text-gray-800 dark:text-white">Welcome Back</h1>
                <p class="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                  Don&apos;t have an account?
                  <Link class="text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500" href="/signup">
                    Sign up here
                  </Link>
                </p>
              </div>

              <div class="mt-5">
                

                <div class="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-700 dark:after:border-neutral-700">Or</div>

               
                <div class="grid grid-cols-2 gap-4">
                  

                  
                  <div class="relative col-span-full">
                    
                    <div class="relative">
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        class="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
                        focus:pt-6
                        focus:pb-2
                        [&:not(:placeholder-shown)]:pt-6
                        [&:not(:placeholder-shown)]:pb-2
                        autofill:pt-6
                        autofill:pb-2" placeholder="Enter Email"/>
                      <label for="hs-hero-signup-form-floating-input-new-password" class="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
                        peer-focus:scale-90
                        peer-focus:translate-x-0.5
                        peer-focus:-translate-y-1.5
                        peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                        peer-[:not(:placeholder-shown)]:scale-90
                        peer-[:not(:placeholder-shown)]:translate-x-0.5
                        peer-[:not(:placeholder-shown)]:-translate-y-1.5
                        peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500">Email</label>
                    </div>
                  </div>
                 
                  
                  <div className="col-span-full">
      <div className="relative">
        <input 
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          required
          className="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
          focus:pt-6
          focus:pb-2
          [&:not(:placeholder-shown)]:pt-6
          [&:not(:placeholder-shown)]:pb-2
          autofill:pt-6
          autofill:pb-2" 
          placeholder="********"
        />
        <label 
          htmlFor="password" 
          className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
          peer-focus:scale-90
          peer-focus:translate-x-0.5
          peer-focus:-translate-y-1.5
          peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
          peer-[:not(:placeholder-shown)]:scale-90
          peer-[:not(:placeholder-shown)]:translate-x-0.5
          peer-[:not(:placeholder-shown)]:-translate-y-1.5
          peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500"
        >
          Password
        </label>
        <button 
          type="button" 
          onClick={togglePasswordVisibility} 
          className="absolute right-4 top-4 text-gray-600 focus:outline-none"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
    </div>
           
                </div>
              
                <div class="mt-5">
                  <button type="submit" class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">Sign In</button>
                </div>

                <div className="mt-4 text-center">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(true)}  // Open modal
                                    className="text-blue-600 hover:underline"
                                >
                                    Forgot Password?
                                </button>
                            </div>
              </div>
            </div>
           
          </div>
        </form>

         {/* Modal */}
         {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-bold text-center mb-4">Reset Password</h2>
                        <input 
                            type="email" 
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-lg text-sm mb-4"
                            placeholder="Enter your email"
                        />
                        <div className="flex justify-center">
                            <button 
                                onClick={handlePasswordReset} 
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Send Reset Email
                            </button>
                            <button 
                                onClick={() => setIsModalOpen(false)}  // Close modal
                                className="ml-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
       
      </div>
   
    </div>
    
    

  </div>
</div>
    </div>
  )
}

export default UserSignin