import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { db, storage, auth } from '../firebase.config';
import { createUserWithEmailAndPassword, updateProfile, onAuthStateChanged, signOut } from "firebase/auth";
import { setDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable, uploadString  } from 'firebase/storage';
import { toast } from 'react-toastify';
import Link from 'next/link';

const UserSignup = () => {
  
  const router = useRouter()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bio, setBio] = useState('');
  const [dob, setDob] = useState('');
  const [nationalID, setNationalID] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [occupation, setOccupation] = useState('');
  const [address, setAddress] = useState('');
  const [accountType, setAccountType] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessRegNum, setBusinessRegNum] = useState('');
  const [userType, setUserType] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [currency, setCurrency] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null); // New state for the selected image
  const [workPeriod, setWorkPeriod] = useState('');

  const [image, setImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('image'); // default tab is 'image'

  const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };


  const [skills, setSkills] = useState([]);
  const [input, setInput] = useState('');

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === ',' && input.trim() !== '') {
      e.preventDefault();
      setSkills([...skills, input.trim()]);
      setInput('');
    }
  };

  const handleSkillDelete = (skill) => {
    setSkills(skills.filter(s => s !== skill));
  };

   
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  }


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

  
  
  // Video upload
  const addVideoToPost = (e) => {
    setErrorMessage('');
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedVideo(readerEvent.target.result);
    };
  };

  // Image upload
  const addImageToPost = (e) => {
    setErrorMessage('');
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  // Function to clear selected image
  const clearSelectedFile = () => {
    setSelectedFile(null);
    setErrorMessage(''); // Clear error message when image is deleted
  };

  // Function to clear selected video
  const clearSelectedVideo = () => {
    setSelectedVideo(null);
    setErrorMessage(''); // Clear error message when video is deleted
  };



  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (password !== confirmPassword) {
      setErrorMessage('Your Password does not match, Please confirm it');
      setLoading(false);
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const storageRef = ref(storage, `profile-images/${user.uid}`);
      const uploadTaskSnapshot = await uploadBytes(storageRef, selectedImage);
  
      // Get the download URL directly from the snapshot
      const imageUrl = await getDownloadURL(uploadTaskSnapshot.ref);
  
      // Update user profile
      await updateProfile(user, {
        displayName: username,
        photoURL: imageUrl,
        password: password 
      });
  
      // Store user data on the Firestore database
      const userData = {
        uid: user.uid,
        displayName: username,
        email: email,
        dob: dob,
        nationalID: nationalID,
        workPeriod: workPeriod,
        password: password,
        photoURL: imageUrl,
        address: address,
        phoneNumber: phoneNumber,
        accountType: accountType,
        status: "Pending",
        userType: userType,
        businessName: businessName,
        businessRegNum: businessRegNum,
        skills: skills,
        createdAt: new Date().toISOString()
      };
  
      await setDoc(doc(db, 'users', user.uid), userData);
  
      const verificationData = {
        uid: user.uid,
        displayName: username,
        email: email,
        password: password,
        photoURL: imageUrl,
        address: address,
        createdAt: new Date().toISOString()
      };
  
      if (selectedFile) {
        const imageRef = ref(storage, `users/${user.uid}/images/${Date.now()}_${selectedFile.name}`);
        await uploadString(imageRef, selectedFile, 'data_url');
        const fileImageUrl = await getDownloadURL(imageRef);
        verificationData.verificationImage = fileImageUrl;
      }
  
      if (selectedVideo) {
        const videoRef = ref(storage, `users/${user.uid}/videos/${Date.now()}_${selectedVideo.name}`);
        await uploadString(videoRef, selectedVideo, 'data_url');
        const videoUrl = await getDownloadURL(videoRef);
        verificationData.verificationVideo = videoUrl;
      }
  
      const verificationDocRef = doc(db, 'users', user.uid);
      await updateDoc(verificationDocRef, verificationData);
  
      setLoading(false);
      toast.success("You signed up successfully");
  
      // Sign out the user
      await signOut(auth);
      router.push('/signin');
    } catch (error) {
      setLoading(false);
      toast.error('Something went wrong');
      console.error("An error occurred while signing up", error);
      return;
    }
  };
  

  // Check if the user is already authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is already signed in, redirect to the appropriate page based on user category
        redirectBasedOnCategory(user.uid);
      }
    });

    // Cleanup the subscription when the component is unmounted
    return () => unsubscribe();
  }, []);

  const redirectBasedOnCategory = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      const userData = userDoc.data();

      if (userData.accountType && userData.accountType === "Super Admin") {
        toast.warning('You are logged in as super admin already')
        router.push(`/my-admin/${userData.uid}/dashboard`);
      } else if (userData.accountType && userData.accountType === "Mini Admin") {
        toast.warning('You are logged in as admin already')
        router.push(`/dashboard/${userData.uid}/dashboard`);
      } else if (userData.accountType && userData.accountType === "Artisan" || userData.accountType ==="Client") {
        router.push(`/account/${user.uid}/dashboard`);
      } else {
        router.push('/');
      }
    } catch (error) {
    //  toast.error(error.message);
    }
  };




  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 9000); // Change image every 9 seconds (adjust as needed)

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div>
       
<div class="relative bg-gradient-to-bl from-blue-100 via-transparent dark:from-blue-950 dark:via-transparent">
  <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
    
    <div class="grid items-center md:grid-cols-2 gap-8 lg:gap-12">
      <div>
        <p class="inline-block text-sm font-medium bg-clip-text bg-gradient-to-l from-blue-600 to-violet-500 text-transparent dark:from-blue-400 dark:to-violet-400">
          Create An Account Today
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
            CraftyHands helped me discover exquisite artisans with unmatched skill. A truly inspiring platform for unique craftsmanship
            </p>
          </div>

          <footer class="mt-3">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <img class="size-8 rounded-full" src="https://media.licdn.com/dms/image/D5603AQFLKbssdhCgBQ/profile-displayphoto-shrink_200_200/0/1694463852475?e=2147483647&v=beta&t=uQ_ZGi__qfe-xvJdPv5PIe5iVES64C1zwSOTc5GX_NU" alt="Image Description"/>
              </div>
              <div class="grow ms-4">
                <div class="font-semibold text-gray-800 dark:text-neutral-200">Juliet Amponsah</div>
                <div class="text-xs text-gray-500 dark:text-neutral-500">Human Resourse Manager - Linmore Carpentary </div>
              </div>
            </div>
          </footer>
        </blockquote>
        
      </div>
      

      <div>
        
        <form
          onSubmit={handleSignUp}
          encType="multipart/form-data" // Add this line for file uploads
        >
          <div class="lg:max-w-lg lg:mx-auto lg:me-0 ms-auto h-[550px] overflow-y-auto">
            
            <div class="p-4 sm:p-7 flex flex-col bg-white rounded-2xl shadow-lg dark:bg-neutral-900">
              <div class="text-center">
                <h1 class="block text-2xl font-bold text-gray-800 dark:text-white">Get Hired or Hire Today</h1>
                <p class="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                  Already have an account?
                  <Link class="text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500" href="/signin">
                    Sign in here
                  </Link>
                </p>
              </div>

              <div class="mt-5">

                <div class="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-700 dark:after:border-neutral-700">Or</div>

                {/* Image Upload */}
           <div style={{marginBottom: '30px'}}>

            <div style={{ cursor: 'pointer' }} className="flex items-center justify-center">
            {selectedImage ? (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected"
                style={{ width: '120px', height: '120px', margin: '10px', borderRadius: '100%', alignItems: 'center', }}
              />
            ) : (
              <label style={{ cursor: 'pointer' }} className="flex items-center justify-center">
              <img src="/images/defaultuser.jpg" alt="" className='w-20 h-20' />

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                required
              />
              </label>
            )}
            </div>
            <span className='text-sm font-semibold text-center flex justify-center items-center'>Upload Profile Image</span>
            </div>
               
                <div class="grid grid-cols-2 gap-4">
                  
                  <div>
                    
                    <div class="relative">
                      <input 
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)} 
                          required
                          class="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
                          focus:pt-6
                          focus:pb-2
                          [&:not(:placeholder-shown)]:pt-6
                          [&:not(:placeholder-shown)]:pb-2
                          autofill:pt-6
                          autofill:pb-2" 
                           placeholder="John Doe"/>
                      <label for="hs-hero-signup-form-floating-input-first-name" class="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
                        peer-focus:scale-90
                        peer-focus:translate-x-0.5
                        peer-focus:-translate-y-1.5
                        peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                        peer-[:not(:placeholder-shown)]:scale-90
                        peer-[:not(:placeholder-shown)]:translate-x-0.5
                        peer-[:not(:placeholder-shown)]:-translate-y-1.5
                        peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500">Full name</label>
                    </div>
                  
                  </div>
                  
                  <div>
                    <div class="relative">
                      <input 
                          type="number" 
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)} 
                          required
                          class="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
                          focus:pt-6
                          focus:pb-2
                          [&:not(:placeholder-shown)]:pt-6
                          [&:not(:placeholder-shown)]:pb-2
                          autofill:pt-6
                          autofill:pb-2" 
                          placeholder="0987654321"/>
                      <label for="hs-hero-signup-form-floating-input-last-name" class="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
                        peer-focus:scale-90
                        peer-focus:translate-x-0.5
                        peer-focus:-translate-y-1.5
                        peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                        peer-[:not(:placeholder-shown)]:scale-90
                        peer-[:not(:placeholder-shown)]:translate-x-0.5
                        peer-[:not(:placeholder-shown)]:-translate-y-1.5
                        peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500">Phone Number</label>
                    </div>
                   
                  </div>
                
                  <div>
                   
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
                        autofill:pb-2" placeholder="you@email.com"/>
                      <label for="hs-hero-signup-form-floating-input-email" class="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
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
                  
                  
                  <div>
                    
                    <div class="relative">
                      <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)} 
                        required
                        type="text" 
                        class="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
                        focus:pt-6
                        focus:pb-2
                        [&:not(:placeholder-shown)]:pt-6
                        [&:not(:placeholder-shown)]:pb-2
                        autofill:pt-6
                        autofill:pb-2" placeholder="Preline"/>
                      <label for="hs-hero-signup-form-floating-input-company-name" class="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
                        peer-focus:scale-90
                        peer-focus:translate-x-0.5
                        peer-focus:-translate-y-1.5
                        peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                        peer-[:not(:placeholder-shown)]:scale-90
                        peer-[:not(:placeholder-shown)]:translate-x-0.5
                        peer-[:not(:placeholder-shown)]:-translate-y-1.5
                        peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500">Address</label>
                    </div>
                    
                  </div>
                  

                  <div class="relative col-span-full">
                    <div class="relative">
                        <select
                          value={userType}
                          onChange={(e) => setUserType(e.target.value)} 
                          required
                          class="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
                          focus:pt-6
                          focus:pb-2
                          [&:not(:placeholder-shown)]:pt-6
                          [&:not(:placeholder-shown)]:pb-2
                          autofill:pt-6
                          autofill:pb-2">
                          <option>Tell Us Who You Are</option>
                          <option value="Business">Business</option>
                          <option value="Individual">Individual</option>
                        </select>
                        <label for="hs-hero-signup-form-floating-input-new-password" class="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
                          peer-focus:scale-90
                          peer-focus:translate-x-0.5
                          peer-focus:-translate-y-1.5
                          peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                          peer-[:not(:placeholder-shown)]:scale-90
                          peer-[:not(:placeholder-shown)]:translate-x-0.5
                          peer-[:not(:placeholder-shown)]:-translate-y-1.5
                          peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500">Who Are You?</label>
                      </div>
                      </div>

                  {userType === "Business" && (<>
                    <div class="col-span-full">
                    <div class="relative">
                      <input 
                        type="text" 
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}  
                        required
                        class="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
                        focus:pt-6
                        focus:pb-2
                        [&:not(:placeholder-shown)]:pt-6
                        [&:not(:placeholder-shown)]:pb-2
                        autofill:pt-6
                        autofill:pb-2" placeholder="********" />
                      <label for="hs-hero-signup-form-floating-input-current-password" class="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
                        peer-focus:scale-90
                        peer-focus:translate-x-0.5
                        peer-focus:-translate-y-1.5
                        peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                        peer-[:not(:placeholder-shown)]:scale-90
                        peer-[:not(:placeholder-shown)]:translate-x-0.5
                        peer-[:not(:placeholder-shown)]:-translate-y-1.5
                        peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500">Business Name</label>
                    </div>
                  </div>

                  <div class="col-span-full">
                    <div class="relative">
                      <input 
                        type="text" 
                        value={businessRegNum}
                        onChange={(e) => setBusinessRegNum(e.target.value)}  
                        required
                        class="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
                        focus:pt-6
                        focus:pb-2
                        [&:not(:placeholder-shown)]:pt-6
                        [&:not(:placeholder-shown)]:pb-2
                        autofill:pt-6
                        autofill:pb-2" placeholder="********" />
                      <label for="hs-hero-signup-form-floating-input-current-password" class="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
                        peer-focus:scale-90
                        peer-focus:translate-x-0.5
                        peer-focus:-translate-y-1.5
                        peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                        peer-[:not(:placeholder-shown)]:scale-90
                        peer-[:not(:placeholder-shown)]:translate-x-0.5
                        peer-[:not(:placeholder-shown)]:-translate-y-1.5
                        peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500">Business Registration Number</label>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-neutral-700"></div>
                  <div class="col-span-full">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                  Verification Documents
                </h3>
                <div className="flex items-center mt-4">
                  
                  <button
                    type="button"
                    className={`mr-4 py-2 px-4 border rounded-md ${activeTab === 'image' ? 'border-blue-500 text-blue-500' : 'border-gray-200 text-gray-800 dark:text-neutral-200'}`}
                    onClick={() => setActiveTab('image')}
                  >
                    Upload Image
                  </button>
                  <button
                    type="button"
                    className={`py-2 px-4 border rounded-md ${activeTab === 'video' ? 'border-blue-500 text-blue-500' : 'border-gray-200 text-gray-800 dark:text-neutral-200'}`}
                    onClick={() => setActiveTab('video')}
                  >
                    Upload Video
                  </button>
                </div>
                {activeTab === 'image' && (
                  <div className="mt-4">
                    <label htmlFor="image" className="inline-block text-sm mb-2 font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
                      Upload a photo of your Business Certificate
                    </label>
                    
                    <label for="af-submit-app-upload-images" class="group p-4 sm:p-7 block cursor-pointer text-center border-2 border-dashed border-gray-200 rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:border-neutral-700">
              <input required id="af-submit-app-upload-images" name="af-submit-app-upload-images" type="file" accept="image/*" class="sr-only" onChange={addImageToPost}/>
              <svg class="size-10 mx-auto text-gray-400 dark:text-neutral-600" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"/>
                <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
              </svg>
              <span class="mt-2 block text-sm text-gray-800 dark:text-neutral-200">
                Browse your device or <span class="group-hover:text-blue-700 text-blue-600">drag &apos;n drop&apos;</span>
              </span>
              <span class="mt-1 block text-xs text-gray-500 dark:text-neutral-500">
                Maximum file size is 2 MB
              </span>
            </label>
                    {selectedFile && (
                      <div className="mt-4 relative">
                        <img
                          src={selectedFile}
                          alt="Selected"
                          className="w-full h-64 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                          onClick={clearSelectedFile}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>

                        </button>
                      </div>
                    )}
                  </div>
                )}
                {activeTab === 'video' && (
                  <div className="mt-4">
                    <label htmlFor="video" className="inline-block text-sm mb-2 font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
                      Upload a video of you holding your business certificate, explaining why you want to be part of our community. also showcase other documents if there are any.
                    </label>
                    
                    <label for="af-submit-app-upload-images" class="group p-4 sm:p-7 block cursor-pointer text-center border-2 border-dashed border-gray-200 rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:border-neutral-700">
                      <input required id="af-submit-app-upload-images" name="af-submit-app-upload-images" type="file" accept="video/*" class="sr-only" onChange={addVideoToPost}/>
                      <svg class="size-10 mx-auto text-gray-400 dark:text-neutral-600" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"/>
                        <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
                      </svg>
                      <span class="mt-2 block text-sm text-gray-800 dark:text-neutral-200">
                        Browse your device or <span class="group-hover:text-blue-700 text-blue-600">drag &apos;n drop&apos;</span>
                      </span>
                      <span class="mt-1 block text-xs text-gray-500 dark:text-neutral-500">
                        Maximum file size is 2 MB
                      </span>
                    </label>
                    {selectedVideo && (
                      <div className="mt-4 relative">
                        <video
                          src={selectedVideo}
                          controls
                          className="w-full h-64 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                          onClick={clearSelectedVideo}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>

                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
                  </>)}

              
                  {userType === "Individual" && (<>
                    <div class="col-span-full">
                    <div class="relative">
                      <input 
                        type="text" 
                        value={nationalID}
                        onChange={(e) => setNationalID(e.target.value)}  
                        required
                        class="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
                        focus:pt-6
                        focus:pb-2
                        [&:not(:placeholder-shown)]:pt-6
                        [&:not(:placeholder-shown)]:pb-2
                        autofill:pt-6
                        autofill:pb-2" placeholder="********" />
                      <label for="hs-hero-signup-form-floating-input-current-password" class="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
                        peer-focus:scale-90
                        peer-focus:translate-x-0.5
                        peer-focus:-translate-y-1.5
                        peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                        peer-[:not(:placeholder-shown)]:scale-90
                        peer-[:not(:placeholder-shown)]:translate-x-0.5
                        peer-[:not(:placeholder-shown)]:-translate-y-1.5
                        peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500">National ID</label>
                    </div>
                  </div>

                  <div class="col-span-full">
                    <div class="relative">
                      <input 
                        type="date" 
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}  
                        required
                        class="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
                        focus:pt-6
                        focus:pb-2
                        [&:not(:placeholder-shown)]:pt-6
                        [&:not(:placeholder-shown)]:pb-2
                        autofill:pt-6
                        autofill:pb-2" placeholder="********" />
                      <label for="hs-hero-signup-form-floating-input-current-password" class="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
                        peer-focus:scale-90
                        peer-focus:translate-x-0.5
                        peer-focus:-translate-y-1.5
                        peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                        peer-[:not(:placeholder-shown)]:scale-90
                        peer-[:not(:placeholder-shown)]:translate-x-0.5
                        peer-[:not(:placeholder-shown)]:-translate-y-1.5
                        peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500">Date Of Birth</label>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-neutral-700"></div>
                  <div class="col-span-full">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                  Verification Documents
                </h3>
                <div className="flex items-center mt-4">
                  
                  <button
                    type="button"
                    className={`mr-4 py-2 px-4 border rounded-md ${activeTab === 'image' ? 'border-blue-500 text-blue-500' : 'border-gray-200 text-gray-800 dark:text-neutral-200'}`}
                    onClick={() => setActiveTab('image')}
                  >
                    Upload Image
                  </button>
                  <button
                    type="button"
                    className={`py-2 px-4 border rounded-md ${activeTab === 'video' ? 'border-blue-500 text-blue-500' : 'border-gray-200 text-gray-800 dark:text-neutral-200'}`}
                    onClick={() => setActiveTab('video')}
                  >
                    Upload Video
                  </button>
                </div>
                {activeTab === 'image' && (
                  <div className="mt-4">
                    <label htmlFor="image" className="inline-block text-sm mb-2 font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
                      Upload a photo of your National ID
                    </label>
                    
                    <label for="af-submit-app-upload-images" class="group p-4 sm:p-7 block cursor-pointer text-center border-2 border-dashed border-gray-200 rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:border-neutral-700">
              <input required id="af-submit-app-upload-images" name="af-submit-app-upload-images" type="file" accept="image/*" class="sr-only" onChange={addImageToPost}/>
              <svg class="size-10 mx-auto text-gray-400 dark:text-neutral-600" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"/>
                <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
              </svg>
              <span class="mt-2 block text-sm text-gray-800 dark:text-neutral-200">
                Browse your device or <span class="group-hover:text-blue-700 text-blue-600">drag &apos;n drop&apos;</span>
              </span>
              <span class="mt-1 block text-xs text-gray-500 dark:text-neutral-500">
                Maximum file size is 2 MB
              </span>
            </label>
                    {selectedFile && (
                      <div className="mt-4 relative">
                        <img
                          src={selectedFile}
                          alt="Selected"
                          className="w-full h-64 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                          onClick={clearSelectedFile}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>

                        </button>
                      </div>
                    )}
                  </div>
                )}
                {activeTab === 'video' && (
                  <div className="mt-4">
                    <label htmlFor="video" className="inline-block text-sm mb-2 font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
                      Upload a video of you holding your National ID, explaining why you want to be part of our community. also showcase other documents if there are any.
                    </label>
                    
                    <label for="af-submit-app-upload-images" class="group p-4 sm:p-7 block cursor-pointer text-center border-2 border-dashed border-gray-200 rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:border-neutral-700">
                      <input required id="af-submit-app-upload-images" name="af-submit-app-upload-images" type="file" accept="video/*" class="sr-only" onChange={addVideoToPost}/>
                      <svg class="size-10 mx-auto text-gray-400 dark:text-neutral-600" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"/>
                        <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
                      </svg>
                      <span class="mt-2 block text-sm text-gray-800 dark:text-neutral-200">
                        Browse your device or <span class="group-hover:text-blue-700 text-blue-600">drag &apos;n drop&apos;</span>
                      </span>
                      <span class="mt-1 block text-xs text-gray-500 dark:text-neutral-500">
                        Maximum file size is 2 MB
                      </span>
                    </label>
                    {selectedVideo && (
                      <div className="mt-4 relative">
                        <video
                          src={selectedVideo}
                          controls
                          className="w-full h-64 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                          onClick={clearSelectedVideo}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>

                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
                  </>)}


                  
                  <div class="relative col-span-full">

                  <div class="relative">
                      <select
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)} 
                        required
                        class="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
                        focus:pt-6
                        focus:pb-2
                        [&:not(:placeholder-shown)]:pt-6
                        [&:not(:placeholder-shown)]:pb-2
                        autofill:pt-6
                        autofill:pb-2">
                        <option>Select Account Type</option>
                        <option value="Artisan">Artisan</option>
                        <option value="Client">Client</option>
                      </select>
                      <label for="hs-hero-signup-form-floating-input-new-password" class="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
                        peer-focus:scale-90
                        peer-focus:translate-x-0.5
                        peer-focus:-translate-y-1.5
                        peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                        peer-[:not(:placeholder-shown)]:scale-90
                        peer-[:not(:placeholder-shown)]:translate-x-0.5
                        peer-[:not(:placeholder-shown)]:-translate-y-1.5
                        peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500">Account Type</label>
                    </div>
                    </div>


                    
                    {accountType === "Client" && (<>

                    {/* 
                  <div class="col-span-full">
                  <div class="relative">
                    <textarea 
                      type="text" 
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}  
                      required
                      class="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
                      focus:pt-6
                      focus:pb-2
                      [&:not(:placeholder-shown)]:pt-6
                      [&:not(:placeholder-shown)]:pb-2
                      autofill:pt-6
                      autofill:pb-2" placeholder="********"></textarea>
                    <label for="hs-hero-signup-form-floating-input-current-password" class="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
                      peer-focus:scale-90
                      peer-focus:translate-x-0.5
                      peer-focus:-translate-y-1.5
                      peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                      peer-[:not(:placeholder-shown)]:scale-90
                      peer-[:not(:placeholder-shown)]:translate-x-0.5
                      peer-[:not(:placeholder-shown)]:-translate-y-1.5
                      peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500">Tell us about yourself</label>
                  </div>
                </div>
                    */}


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


    <div className="col-span-full">
      <div className="relative">
        <input 
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)} 
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
         Confirm Password
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

                  
                  
                  
                 
                  <div class="relative col-span-full">
                  <div class="mt-5 flex items-center">
                  <div class="flex">
                    <input required name="remember-me" type="checkbox" class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"/>
                  </div>
                  <div class="ms-3">
                    <label for="remember-me" class="text-sm dark:text-white">I accept the <a class="text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500" href="#">Terms and Conditions</a></label>
                  </div>
                </div>
              

                <div class="mt-5">
                  <button 
                    type="submit" 
                    disabled={loading}
                    class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                  </div>
                  {errorMessage && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}
                  </div>
                  </>)}



                    
                  {accountType === "Artisan" && (<>

                  <div class="col-span-full">
                  <div class="relative">
                    <textarea 
                      type="text"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}  
                      class="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
                      focus:pt-6
                      focus:pb-2
                      [&:not(:placeholder-shown)]:pt-6
                      [&:not(:placeholder-shown)]:pb-2
                      autofill:pt-6
                      autofill:pb-2" placeholder="********"></textarea>
                    <label for="hs-hero-signup-form-floating-input-current-password" class="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
                      peer-focus:scale-90
                      peer-focus:translate-x-0.5
                      peer-focus:-translate-y-1.5
                      peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                      peer-[:not(:placeholder-shown)]:scale-90
                      peer-[:not(:placeholder-shown)]:translate-x-0.5
                      peer-[:not(:placeholder-shown)]:-translate-y-1.5
                      peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500">Tell us about yourself</label>
                  </div>
                  </div>

                  <div className="relative col-span-full">
                  <div className="relative">
                  <input
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        type="text" 
                        class="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
                        focus:pt-6
                        focus:pb-2
                        [&:not(:placeholder-shown)]:pt-6
                        [&:not(:placeholder-shown)]:pb-2
                        autofill:pt-6
                        autofill:pb-2"  placeholder="Enter skills, separated by commas" />
                      <label for="hs-hero-signup-form-floating-input-company-name" class="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
                        peer-focus:scale-90
                        peer-focus:translate-x-0.5
                        peer-focus:-translate-y-1.5
                        peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                        peer-[:not(:placeholder-shown)]:scale-90
                        peer-[:not(:placeholder-shown)]:translate-x-0.5
                        peer-[:not(:placeholder-shown)]:-translate-y-1.5
                        peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500">Enter skills, separated by commas</label>

                          </div>
                          <div className="flex flex-wrap mt-2">
                            {skills.map((skill, index) => (
                              <div key={index} className="bg-gray-200 text-black rounded-full px-4 py-1 m-1 flex items-center">
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => handleSkillDelete(skill)}
                                  className="ml-2 text-sm text-red-500"
                                >
                                  &times;
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div  class="relative col-span-full">
                    <div class="relative">
                      <textarea 
                        type="text" 
                        value={workPeriod}
                        onChange={(e) => setWorkPeriod(e.target.value)} 
                        class="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
                        focus:pt-6
                        focus:pb-2
                        [&:not(:placeholder-shown)]:pt-6
                        [&:not(:placeholder-shown)]:pb-2
                        autofill:pt-6
                        autofill:pb-2" placeholder="********"></textarea>
                      <label for="hs-hero-signup-form-floating-input-new-password" class="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
                        peer-focus:scale-90
                        peer-focus:translate-x-0.5
                        peer-focus:-translate-y-1.5
                        peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                        peer-[:not(:placeholder-shown)]:scale-90
                        peer-[:not(:placeholder-shown)]:translate-x-0.5
                        peer-[:not(:placeholder-shown)]:-translate-y-1.5
                        peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500">Working Periods (Days/Hours)</label>
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


    <div className="col-span-full">
      <div className="relative">
        <input 
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)} 
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
         Confirm Password
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



                  <div class="relative col-span-full">
                  <div class="mt-5 flex items-center">
                  <div class="flex">
                    <input name="remember-me" type="checkbox" class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"/>
                  </div>
                  <div class="ms-3">
                    <label for="remember-me" class="text-sm dark:text-white">I accept the <a class="text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500" href="#">Terms and Conditions</a></label>
                  </div>
                  </div>


                  <div class="mt-5">
                  <button 
                    type="submit" 
                    disabled={loading}
                    class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                  </div>
                  {errorMessage && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}
                  </div>
                  </>)}
           
                </div>
              
              
                
              </div> 
              </div>


            </div>
           
        
        </form>
       
      </div>
   
    </div>
    
    

   
  </div>
</div>
    </div>
  )
}

export default UserSignup