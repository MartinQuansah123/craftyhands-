import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase.config'; // Firebase configuration
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const router = useRouter();
  const { id } = router.query;
  const [jobs, setJobs] = useState([]); // Renamed for clarity
  const [totalAmount, setTotalAmount] = useState(0); // This will represent earnings or expenditure
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (id) {
        try {
          const userDocRef = doc(db, 'users', id);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUserDetails(userData);
            console.log('User Details:', userData);
            
            if (userData.accountType === "Artisan" || userData.accountType === "Client") {
              // Fetch job booking data based on user type
              fetchJobBookings(userData);
            }

            // Check user type and redirect accordingly
            if (!userData.accountType === "Artisan" && userData.accountType === "Mini Admin") {
              router.push(`/dashboard/${id}/dashboard`);
            } else if (!userData.accountType === "Artisan" && userData.accountType === "Super Admin") {
              router.push(`/my-admin/${id}/dashboard`);
            } else if (!userData.accountType === "Client" && userData.accountType === "Mini Admin") {
              router.push(`/dashboard/${id}/dashboard`);
            } else if (!userData.accountType === "Client" && userData.accountType === "Super Admin") {
              router.push(`/my-admin/${id}/dashboard`);
            }

          } else {
            console.log('User not found');
            router.push('/signin');
          }
        } catch (error) {
          console.error('Error fetching user data', error);
        }
      }
    };

    console.log('UID:', id); // Log UID to check if it's defined

    fetchUserData();
  }, [id, router]);

  // Fetch job bookings based on user type
  const fetchJobBookings = async (userData) => {
    try {
      let jobsQuery;

      if (userData.accountType === "Artisan") {
        // Fetch jobs where the artisanId matches the current user's id
        jobsQuery = query(collection(db, 'jobbooking'), where('artisanId', '==', id));
      } else if (userData.accountType === "Client") {
        // Fetch jobs where the clientId matches the current user's id
        jobsQuery = query(collection(db, 'jobbooking'), where('clientId', '==', id));
      }

      const jobsSnapshot = await getDocs(jobsQuery);
      const jobsData = jobsSnapshot.docs.map(doc => doc.data());

      setJobs(jobsData);

      // Calculate total earnings or expenditure based on account type
      const totalAmount = jobsData.reduce((acc, job) => acc + job.amount, 0);
      setTotalAmount(totalAmount);
    } catch (error) {
      toast.error('Error fetching job bookings:', error.message);
      console.error('Error fetching job bookings:', error.message);
    } finally {
      setLoading(false);
    }
  };


  const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + '...';
    }
    return str;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  } 

  return (
    <section>
          <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="bg-blue-600 p-8 md:p-12 lg:px-16 lg:py-24">
                <div className="mx-auto max-w-xl text-center">
                  <h2 className="text-2xl font-bold text-white md:text-3xl">
                    {userDetails?.accountType === "Artisan" ? 'Total Earnings' : 'Total Expenditure'}
                  </h2>

                  <p className="hidden text-white/90 sm:mt-4 sm:block">
                    {userDetails.accountType === "Client" && (
                      <>Welcome to your Client Dashboard! Book artisans, and manage your preferences effortlessly from this easy-to-use interface.</>
                    )}
                    {userDetails.accountType === "Artisan" && (
                      <>Welcome to your Artisan Dashboard! Manage bookings, update your profile, and track your earnings all in one convenient place.</>
                    )}
                  </p>

                {/*  <div className="mt-4 md:mt-8">
                    <a
                      href="#"
                      className="inline-block rounded border border-white bg-white px-12 py-3 text-sm font-semibold text-xl text-blue-500 transition hover:bg-transparent hover:text-white focus:outline-none focus:ring focus:ring-yellow-400"
                    >
                      GHS{totalAmount.toFixed(2)}
                    </a>
                    </div> */}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-1 lg:grid-cols-2">
                <img
                  alt=""
                  src="https://images.unsplash.com/photo-1621274790572-7c32596bc67f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8&auto=format&fit=crop&w=654&q=80"
                  className="h-40 w-full object-cover sm:h-56 md:h-full"
                />

                <img
                  alt=""
                  src="https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                  className="h-40 w-full object-cover sm:h-56 md:h-full"
                />
              </div>
            </div>
          </div>

          <div className="container mx-auto p-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div>
                <h3 className="text-xl font-bold mb-4">
                  {userDetails?.accountType === "Artisan" ? 'Job Requests Summary' : 'Expenditure Summary'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {userDetails?.accountType === "Artisan"  ? (
                    jobs.map((job, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-md cursor-pointer">
                        <div class="h-38 flex flex-col justify-center items-center bg-[url('https://preline.co/assets/svg/examples/abstract-bg-1.svg')] bg-no-repeat bg-cover bg-center rounded-t-xl">
                          <img src={job.clientImage} alt="project image" className='w-full h-38 rounded-md' />
                        </div>
                        <h4 className="text-lg font-semibold mb-2">Client: {truncateString(job.clientName, 15)}</h4>
                        <p className="text-gray-800 font-semibold">Details: {truncateString(job.jobDetails, 15)}</p>
                        <p className="text-gray-800 font-semibold">Feedback: {job.feedback}</p>
                      {/*  <p className="text-gray-800 font-semibold">Amount: {job.amount}</p> */}
                      <p className="text-gray-600">Booked on: {new Date(job.createdAt).toLocaleDateString()}</p>
                     </div>
                    ))
                  ) : (
                    jobs.map((job, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-md cursor-pointer">
                        <div class="h-38 flex flex-col justify-center items-center bg-[url('https://preline.co/assets/svg/examples/abstract-bg-1.svg')] bg-no-repeat bg-cover bg-center rounded-t-xl">
                          <img src={job.artisanImage} alt="project image" className='w-full h-38 rounded-md' />
                        </div>
                        <h4 className="text-lg font-semibold mb-2">Artisan: {truncateString(job.artisanName, 15 )}</h4>
                        <p className="text-gray-800 font-semibold">Details: {truncateString(job.jobDetails, 15)}</p>
                       {/* <h4 className="font-semibold mb-2">Amount: {job.amount}</h4> */}
                        <p className="text-gray-600">Booked on: {new Date(job.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
       
    </section>
  );
};

export default Dashboard;
