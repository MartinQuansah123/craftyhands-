{/*
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc, addDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';
import Layout from '@/components/Home/layout';

const ProfilePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [artisan, setArtisan] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [jobDetails, setJobDetails] = useState('');
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [bookingFeedback, setBookingFeedback] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        const docRef = doc(db, 'users', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setArtisan(docSnap.data());
          fetchBookings(id);
          fetchReviews(id);
        } else {
          toast.error('No such artisan found!');
        }
      }
    };

    const fetchBookings = async (artisanId) => {
      const q = query(collection(db, 'jobbooking'), where('artisanId', '==', artisanId));
      const querySnapshot = await getDocs(q);
      setBookings(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };

    const fetchReviews = async (artisanId) => {
      const q = query(collection(db, 'clientsCommentsReviews'), where('artisanId', '==', artisanId));
      const querySnapshot = await getDocs(q);
      setReviews(querySnapshot.docs.map(doc => doc.data()));
    };

    fetchUser();

    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, [id]);

  const handleBookArtisan = async () => {
    if (!currentUser) {
      toast.error('You need to be signed in to book an artisan.');
      router.push('/signin');
      return;
    }

    if (jobDetails.trim() === '') {
      toast.error('Please provide job details.');
      return;
    }

    try {
      await addDoc(collection(db, 'jobbooking'), {
        artisanId: id,
        artisanName: artisan.displayName,
        clientId: currentUser.uid,
        clientName: currentUser.displayName,
        jobDetails,
        createdAt: new Date().toISOString(),
      });
      toast.success('Job booked successfully!');
      setJobDetails('');
      fetchBookings(id);
    } catch (error) {
      toast.error('Failed to book job. Please try again.');
      console.error('Error booking job:', error);
    }
  };

  const handleLeaveReview = async () => {
    if (reviewRating === 0 || reviewText.trim() === '') {
      toast.error('Please provide a rating and review.');
      return;
    }

    try {
      await addDoc(collection(db, 'clientsCommentsReviews'), {
        artisanId: id,
        clientId: currentUser.uid,
        clientName: currentUser.displayName,
        clientPhotoURL: currentUser.photoURL,
        rating: reviewRating,
        comment: reviewText,
        createdAt: new Date().toISOString(),
      });
      toast.success('Review submitted successfully!');
      setReviewRating(0);
      setReviewText('');
      fetchReviews(id);
    } catch (error) {
      toast.error('Failed to submit review. Please try again.');
      console.error('Error submitting review:', error);
    }
  };

  const handleBookingFeedback = async (feedback) => {
    try {
      const q = query(collection(db, 'jobbooking'), where('artisanId', '==', id), where('clientId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, { feedback });
        setBookingFeedback(feedback);
        toast.success('Feedback submitted successfully!');
      }
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.');
      console.error('Error submitting feedback:', error);
    }
  };

  const isCurrentUser = currentUser && currentUser.uid === id;
  const hasBooked = bookings.some(booking => booking.clientId === currentUser?.uid);

  return (
    <Layout>
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-lg">
        {artisan ? (
          <>
            <img src={artisan.photoURL} alt={artisan.displayName} className="w-full h-48 object-cover rounded mb-4" />
            <h1 className="text-3xl font-bold mb-2">{artisan.displayName}</h1>
            <p className="text-gray-700 mb-2"><strong>Business Name:</strong> {artisan.businessName}</p>
            <p className="text-gray-700 mb-2"><strong>Address:</strong> {artisan.address}</p>
            <p className="text-gray-700 mb-2"><strong>Work Period:</strong> {artisan.workPeriod}</p>
            <div className="flex flex-wrap gap-2 mt-2 mb-4">
              {artisan.skills.map((skill, idx) => (
                <span key={idx} className="bg-blue-200 text-blue-800 px-2 py-1 rounded">{skill}</span>
              ))}
            </div>

            <div className="mb-4">
              <p className="text-gray-700"><strong>Number of Bookings:</strong> {bookings.length}</p>
              <p className="text-gray-700"><strong>Likes:</strong> {bookings.filter(booking => booking.feedback === 'Satisfied').length}</p>
              <p className="text-gray-700"><strong>Dislikes:</strong> {bookings.filter(booking => booking.feedback === 'Not Satisfied').length}</p>
              <p className="text-gray-700"><strong>Did Not Show Up:</strong> {bookings.filter(booking => booking.feedback === 'Did Not Show Up').length}</p>
            </div>

            {isCurrentUser ? (
              <button
                onClick={() => router.push(`/edit-profile/${id}`)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
              >
                Edit Profile
              </button>
            ) : (
              <>
                {!hasBooked ? (
                  <>
                    <textarea
                      className="border p-2 rounded w-full mb-4"
                      placeholder="Enter job details"
                      value={jobDetails}
                      onChange={(e) => setJobDetails(e.target.value)}
                    />
                    <button
                      onClick={handleBookArtisan}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                    >
                      Book Artisan
                    </button>
                  </>
                ) : (
                  <>
                    {bookingFeedback ? (
                      <div className="flex gap-4 mt-4">
                        <button
                          onClick={() => handleBookingFeedback('Satisfied')}
                          className={`bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200 ${bookingFeedback === 'Satisfied' ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={bookingFeedback === 'Satisfied'}
                        >
                          👍 Satisfied
                        </button>
                        <button
                          onClick={() => handleBookingFeedback('Not Satisfied')}
                          className={`bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200 ${bookingFeedback === 'Not Satisfied' ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={bookingFeedback === 'Not Satisfied'}
                        >
                          👎 Not Satisfied
                        </button>
                        <button
                          onClick={() => handleBookingFeedback('Did Not Show Up')}
                          className={`bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition duration-200 ${bookingFeedback === 'Did Not Show Up' ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={bookingFeedback === 'Did Not Show Up'}
                        >
                          🚫 Did Not Show Up
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-4 mt-4">
                          <button
                            onClick={() => handleBookingFeedback('Satisfied')}
                            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200"
                          >
                            👍 Satisfied
                          </button>
                          <button
                            onClick={() => handleBookingFeedback('Not Satisfied')}
                            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200"
                          >
                            👎 Not Satisfied
                          </button>
                          <button
                            onClick={() => handleBookingFeedback('Did Not Show Up')}
                            className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition duration-200"
                          >
                            🚫 Did Not Show Up
                          </button>
                        </div>
                      </>
                    )}

                    <div className="mt-8">
                      <h2 className="text-2xl font-bold mb-4">Leave a Review</h2>
                      <div className="flex mb-4">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className={`text-2xl ${reviewRating >= star ? 'text-yellow-500' : 'text-gray-400'}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      <textarea
                        className="border p-2 rounded w-full mb-4"
                        placeholder="Write your review here"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                      />
                      <button
                        onClick={handleLeaveReview}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                      >
                        Submit Review
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Reviews</h2>
              {reviews.length > 0 ? (
                reviews.map((review, idx) => (
                  <div key={idx} className="border p-4 rounded mb-4">
                    <div className="flex items-center mb-2">
                      <img src={review.clientPhotoURL} alt={review.clientName} className="w-10 h-10 rounded-full mr-2" />
                      <p className="text-gray-700"><strong>{review.clientName}</strong></p>
                      <div className="flex ml-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <span key={star} className={`text-xl ${review.rating >= star ? 'text-yellow-500' : 'text-gray-400'}`}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}
            </div>
          </>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
    </Layout>
  );
};

export default ProfilePage;
*/}

import Image from "next/image";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import { AiFillHome, AiOutlineClockCircle, AiOutlineInbox, AiOutlineUser } from "react-icons/ai";
import { MdOutlineAddComment, MdOutlineDangerous, MdOutlineLocationOn, MdOutlineLockClock, MdVerified } from "react-icons/md";
import { RiContactsBook3Line, RiMoneyDollarCircleLine, RiShareBoxLine, RiSkull2Line, RiTeamLine } from "react-icons/ri";
import { BiCategoryAlt } from "react-icons/bi";
import Moment from 'react-moment';
import { SlDislike, SlLike } from "react-icons/sl";
import { BsClock } from "react-icons/bs";

import { BsGift } from "react-icons/bs";

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc, addDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';
import Layout from '@/components/Home/layout';
import { PiClockUserThin } from "react-icons/pi";

export default function ArtisanId() {
  const [amount, setAmount] = useState('');
  const [totalDonations, setTotalDonations] = useState(0);
  const [donationCount, setDonationCount] = useState(0);
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { id } = router.query;
  const [artisan, setArtisan] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [jobDetails, setJobDetails] = useState('');
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [bookingFeedback, setBookingFeedback] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        const docRef = doc(db, 'users', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setArtisan(docSnap.data());
          fetchBookings(id);
          fetchReviews(id);
        } else {
          toast.error('No such artisan found!');
        }
      }
    };

    const fetchBookings = async (artisanId) => {
      const q = query(collection(db, 'jobbooking'), where('artisanId', '==', artisanId));
      const querySnapshot = await getDocs(q);
      setBookings(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };

    const fetchReviews = async (artisanId) => {
      const q = query(collection(db, 'clientsCommentsReviews'), where('artisanId', '==', artisanId));
      const querySnapshot = await getDocs(q);
      setReviews(querySnapshot.docs.map(doc => doc.data()));
    };

    fetchUser();

    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, [id]);

  const handleBookArtisan = async () => {
    if (!currentUser) {
      toast.error('You need to be signed in to book an artisan.');
      router.push('/signin');
      return;
    }

    if (jobDetails.trim() === '') {
      toast.error('Please provide job details.');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'jobbooking'), {
        artisanId: id,
        artisanName: artisan.displayName,
        artisanImage: artisan.photoURL,
        clientId: currentUser.uid,
        clientName: currentUser.displayName,
        clientImage: currentUser.photoURL,
        jobDetails,
        createdAt: new Date().toISOString(),
      });

      await updateDoc(docRef, { id: docRef.id });

      toast.success('Job booked successfully!');
      setJobDetails('');
      fetchBookings(id);
    } catch (error) {
     // toast.error('Failed to book job. Please try again.');
      console.error('Error booking job:', error);
    }
  };

  const handleLeaveReview = async () => {
    if (!currentUser) {
      toast.error('You need to be signed in to leave a review.');
      router.push('/signin');
      return;
    }

    if (reviewRating === 0 || reviewText.trim() === '') {
      toast.error('Please provide a rating and review.');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'clientsCommentsReviews'), {
        artisanId: id,
        clientId: currentUser.uid,
        clientName: currentUser.displayName,
        clientPhotoURL: currentUser.photoURL,
        rating: reviewRating,
        comment: reviewText,
        createdAt: new Date().toISOString(),
      });

      await updateDoc(docRef, { id: docRef.id });

      toast.success('Review submitted successfully!');
      setReviewRating(0);
      setReviewText('');
      fetchReviews(id);
    } catch (error) {
     // toast.error('Failed to submit review. Please try again.');
      console.error('Error submitting review:', error);
    }
  };

  const handleBookingFeedback = async (feedback) => {
    try {
      const q = query(collection(db, 'jobbooking'), where('artisanId', '==', id), where('clientId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, { feedback });
        setBookingFeedback(feedback);
        toast.success('Feedback submitted successfully!');
      }
    } catch (error) {
     // toast.error('Failed to submit feedback. Please try again.');
      console.error('Error submitting feedback:', error);
    }
  };

  const isCurrentUser = currentUser && currentUser.uid === id;
  const hasBooked = bookings.some(booking => booking.clientId === currentUser?.uid);

  return (
    <Layout className={` ${inter.className}`}>
      
      {artisan ? (
      <div className="lg:flex m-0 md:m-10 lg:m-10 lg:space-x-5 items-center justify-center">
        <div className="md:w-[700px]">
          <div className="lg:flex-1 border-t-8 border-rose-600 bg-white pb-10">
            <div className="carousel">
              <div className={` relative w-full`}>
                <img
                  src={artisan.photoURL}
                  className="w-full h-[300px] md:w-[700px] lg:w-[700px] md:h-[400px] lg:h-[400px]"
                  alt="project image"
                />
                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 p-2 text-white flex justify-between font-semibold tracking-widest">
                  {artisan.displayName}
                  <span className="flex">
                    <span className="p-1"><MdOutlineLocationOn className="text-lg" /></span>   {artisan.address}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="m-5 h-[310px] overflow-y-auto ">
          <div className="flex flex-wrap gap-2 mt-2">
                              {artisan.skills.map((skill, idx) => (
                                <span key={idx} className="bg-rose-200 text-rose-800 px-2 py-1 rounded">{skill}</span>
                              ))}
                            </div>
            <div className="flex">
              <p className="text-2xl text-gray-700 font-bold">{artisan.displayName}</p>
              {artisan.isVerified && (
                <span className="text-rose-600 p-3"><MdVerified /></span>
              )}
            </div>
            <p className="my-5 flex justify-between mr-2 font-normal">
              <div className="flex">
                <span className="text-gray-400 p-1"><AiOutlineClockCircle className="" />
                </span>
                <span className="text-gray-400">Joined on <Moment fromNow>{artisan.createdAt && artisan.createdAt}</Moment></span>
              </div> 
              
              
            </p>
            <p className="text-gray-700 mb-2"><strong>Work Period:</strong> {artisan.workPeriod}</p>
            <div className="divider"></div>
            <p className="my-5">{artisan.bio}</p>
            <div className="divider"></div>
              
            
           
          </div>
        </div>
        <div className="lg:w-[30%]  lg:inline md:h-[850px] overflow-y-auto">
          
          
          <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-lg">
        {artisan ? (
          <>
            <button className="items-center text-rose-500 justify-center w-full p-2 font-semibold bg-white border border-rose-500 hover:bg-green-100 hover:border-green-600">
              <span>{bookings.length} Bookings</span>
            </button>
            
            <div className="mb-4 flex justify-between">
                 <p className="text-gray-700 flex gap-1 items-center p-2"> <span className="text-lg">{bookings.filter(booking => booking.feedback === 'Satisfied').length}</span> <SlLike className="text-xl" /></p>
              <p className="text-gray-700 flex gap-1 items-center p-2"> <span className="text-lg">{bookings.filter(booking => booking.feedback === 'Not Satisfied').length}</span> <SlDislike className="text-xl"  /></p>
              <p className="text-gray-700 flex gap-1 items-center p-2"> <span className="text-lg">{bookings.filter(booking => booking.feedback === 'Did Not Show Up').length}</span>  <BsClock className="text-xl" /></p>
            </div>

            {isCurrentUser ? (
              <button
                onClick={() => router.push(`/edit-profile/${id}`)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
              >
                Edit Profile
              </button>
            ) : (
              <>
                {!hasBooked ? (
                  <>
                    <textarea
                      className="border p-2 rounded w-full mb-4"
                      placeholder="Enter job details"
                      value={jobDetails}
                      onChange={(e) => setJobDetails(e.target.value)}
                    />
                    <button
                      onClick={handleBookArtisan}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                    >
                      Book Artisan
                    </button>
                  </>
                ) : (
                  <>
                    {bookingFeedback ? (
                      <div className="flex gap-4 mt-4">
                        <button
                          onClick={() => handleBookingFeedback('Satisfied')}
                          className={`bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200 ${bookingFeedback === 'Satisfied' ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={bookingFeedback === 'Satisfied'}
                        >
                          👍 Satisfied
                        </button>
                        <button
                          onClick={() => handleBookingFeedback('Not Satisfied')}
                          className={`bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200 ${bookingFeedback === 'Not Satisfied' ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={bookingFeedback === 'Not Satisfied'}
                        >
                          👎 Not Satisfied
                        </button>
                        <button
                          onClick={() => handleBookingFeedback('Did Not Show Up')}
                          className={`bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition duration-200 ${bookingFeedback === 'Did Not Show Up' ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={bookingFeedback === 'Did Not Show Up'}
                        >
                          🚫 Did Not Show Up
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-4 mt-4">
                          <button
                            onClick={() => handleBookingFeedback('Satisfied')}
                            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200"
                          >
                            👍 Satisfied
                          </button>
                          <button
                            onClick={() => handleBookingFeedback('Not Satisfied')}
                            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200"
                          >
                            👎 Not Satisfied
                          </button>
                          <button
                            onClick={() => handleBookingFeedback('Did Not Show Up')}
                            className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition duration-200"
                          >
                            🚫 Did Not Show Up
                          </button>
                        </div>
                      </>
                    )}

                    <div className="mt-8">
                      <h2 className="text-2xl font-bold mb-4">Leave a Review</h2>
                      <div className="flex mb-4">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className={`text-2xl ${reviewRating >= star ? 'text-yellow-500' : 'text-gray-400'}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      <textarea
                        className="border p-2 rounded w-full mb-4"
                        placeholder="Write your review here"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                      />
                      <button
                        onClick={handleLeaveReview}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                      >
                        Submit Review
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

            <div className="mt-8 h-[200px] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Reviews</h2>
              {reviews.length > 0 ? (
                reviews.map((review, idx) => (
                  <div key={idx} className="border p-4 rounded mb-4">
                    <div className="flex items-center mb-2">
                      <img src={review.clientPhotoURL} alt={review.clientName} className="w-10 h-10 rounded-full mr-2" />
                      <p className="text-gray-700"><strong>{review.clientName}</strong></p>
                      <div className="flex ml-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <span key={star} className={`text-xl ${review.rating >= star ? 'text-yellow-500' : 'text-gray-400'}`}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}
            </div>
          </>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>


          <div className="bg-gray-200 mt-4">
            <div className="bg-white p-5 text-sm border rounded-lg">
              <div className="font-bold text-center text-black">Safety tips</div>
              <ul className="list-disc ml-6 text-black font-normal text-[10px]">
                <li>Protect your account with unique and secure passwords.</li>
                <li>Add an extra layer of security to your account.</li>
                <li>Notify platform support if you notice anything unusual.</li>
                <li>Help us maintain a safe crowdfunding environment.</li>
                <li>Only donate when you are satisfied</li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-200 mt-4">
            <div className="bg-white p-5 text-sm border rounded-lg">
              <div className="flex justify-between mt-3">
                <button className="text-blue-500 hover:bg-blue-600 hover:text-white bg-white px-4 py-2 rounded text-[10px] border border-blue-500">
                  Mark Unavailable
                </button>
                <button className="text-red-500 hover:bg-red-500 hover:text-white bg-white px-4 py-2 rounded text-[10px] border border-red-500">
                  <AiFillHome className="text-[12px] text-red-600" /> Report Abuse
                </button>
              </div>
            </div>
          </div>
       {/*   <div className="bg-gray-200 mt-4">
            <div className="bg-white p-5 text-sm border rounded-lg">
              <button className="items-center text-rose-500 justify-center font-semibold w-full p-2 bg-white border border-rose-500 hover:bg-green-100 hover:border-green-600">
                Post Campaign Like This
              </button>
            </div>
          </div>
        */}
        </div>
      </div>
      ) : (<p>No artisan</p>)}
    </Layout>
  );
}



















{/*
import Image from "next/image";
import { Inter } from "next/font/google";
import Layout from "@/components/layout";
import CTA from "@/components/CTA";
import FeaturedProjects from "@/components/FeaturedProjects";
const inter = Inter({ subsets: ["latin"] });
import ProjectDetailsPage from "@/components/projects/SingleProject";
import { AiFillHome, AiOutlineClockCircle, AiOutlineInbox, AiOutlineUser } from "react-icons/ai"
import { MdOutlineAddComment, MdOutlineLocationOn, MdOutlineLockClock, MdVerified } from "react-icons/md";
import { RiContactsBook3Line, RiMoneyDollarCircleLine, RiShareBoxLine, RiSkull2Line, RiTeamLine } from "react-icons/ri";
import { BiCategoryAlt } from "react-icons/bi";
import Moment from 'react-moment';

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { BsGift } from "react-icons/bs";

export default function Projectid() {
  const router = useRouter();
  const { projectId } = router.query; // Extract projectId from URL parameters

  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectDoc = await getDoc(doc(db, 'projects', projectId));
        if (projectDoc.exists()) {
          setProject({ id: projectDoc.id, ...projectDoc.data() });
        } else {
          console.error('Project not found');
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };

    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  if (!project) {
    return <div>Loading...</div>; // Display loading indicator while fetching project details
  }

  return (
    <Layout
      className={` ${inter.className}`}
      >
     <div className="lg:flex m-0 md:m-10 lg:m-10 lg:space-x-5 items-center justify-center">
        <div className="md:w-[700px]">
        <div className="lg:flex-1 border-t-8 border-rose-600 bg-white pb-10">
        <div className="carousel">
        <div
          className={` relative w-full`}
        >
          <img src={project.image} className="w-full h-[300px] md:w-[700px] lg:w-[700px] md:h-[400px]  lg:h-[400px]" alt="project image" />
          <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 p-2 text-white flex justify-between font-semibold tracking-widest">
               {project.displayName}
                <span className="flex">
                <span className="p-1"><MdOutlineLocationOn className="text-lg"/></span>   {project.location}
                </span>
           </div>
          
        </div>
    </div>
    </div>
          <div className="m-5 h-[310px] overflow-y-auto ">
            <div className="flex">
            <p className="text-2xl text-gray-700 font-bold">{project.title}</p>

            {project.isVerified && (
              <span className="text-rose-600 p-3"><MdVerified /></span>
            )}
            </div>
            <p className="my-5 flex justify-between mr-2 font-normal">
              <div className="flex">
            <span className="text-gray-400 p-1"><AiOutlineClockCircle className="" />
            </span>
            <span className="text-gray-400">Created <Moment fromNow>{project.createdAt && project.createdAt}</Moment></span>
            </div> - 
            <div className="flex">
            <span className="text-rose-600 p-1"><MdOutlineLockClock className="text-lg"/></span> 
            <span className="text-rose-600">Ends <Moment fromNow>{project.deadline && project.deadline}</Moment></span>
            </div>
            </p>

            <div className="mt-5 flex text-rose-600 font-semibold">
            <span className="p-1"><BiCategoryAlt/></span> <span>{project.category}</span>
            </div>

            <div className="divider"></div>
           
            <p className="my-5">{project.description}</p>
            
            <div className="divider"></div>

            <div>
                <div className="mt-5 flex font-semibold">
                <span className="p-1"><RiMoneyDollarCircleLine /></span> <span>Outlined Budget</span>
                </div>
                <p className="my-1">{project.budget}</p>
            </div>

            <div className="divider"></div>

            <div>
                <div className="mt-5 flex font-semibold">
                <span className="p-1"><RiTeamLine /></span> <span>Team Members</span>
                </div>
                <p className="my-1">{project.team}</p>
            </div>

            <div className="divider"></div>

            <div>
                <div className="mt-5 flex font-semibold">
                <span className="p-1"><BsGift /></span> <span>Rewards</span>
                </div>
                <p className="my-1">{project.rewards}</p>
            </div>

            <div className="divider"></div>

            <div>
                <div className="mt-5 flex font-semibold">
                <span className="p-1"><RiContactsBook3Line /></span> <span>Contact Info</span>
                </div>
                <p className="my-1">{project.contactInfo}</p>
            </div>

            <div className="divider"></div>

            <div>
                <div className="mt-5 flex font-semibold">
                <span className="p-1"><RiShareBoxLine /></span> <span>Social Links</span>
                </div>
                <p className="my-1">{project.socialLinks}</p>
            </div>

            <div className="divider"></div>

            <div>
                <div className="mt-5 flex font-semibold">
                <span className="p-1"><RiSkull2Line /></span> <span>Risks</span>
                </div>
                <p className="my-1">{project.risks}</p>
            </div>

            <div className="divider"></div>

            <div>
                <div className="mt-5 flex font-semibold">
                <span className="p-1"><MdOutlineAddComment /></span> <span>FAQs</span>
                </div>
                <p className="my-1">{project.faqs}</p>
            </div>

           
          </div>
        </div>

        <div className="lg:w-[30%] hidden lg:inline">
  <div className="bg-gray-200">
    <div className="bg-white p-5 text-sm border-double border rounded-lg">
      <div className="font-bold text-lg text-black">GHS {project.goal}, {project.isVerified && (
              <span className="text-rose-600">Negotiable</span>
            )}</div>
            <div className="text-center my-4">
       <span className="text-rose-600 text-[11px]">Market Price: GHS {project.goal}</span>
            </div>
      <button className="items-center text-rose-500 justify-center w-full p-2 bg-white border border-rose-500 hover:bg-green-100 hover:border-green-600">
          Request call back
      </button>
    </div>
  </div>

  <div className="bg-gray-200 mt-4">
    <div className="bg-white p-5 text-sm border-double border rounded-lg">
        
<div className="flex items-center space-x-4">
    <img className="w-10 h-10 rounded-full" src={project.addedByImage} alt="profile" />
    <div className="font-medium dark:text-black mb-2">
        <div className="text-black">{project.displayName && project.displayName.slice(0, 15)}</div>
        <div className="text-[8px] text-black bg-gray-100 rounded-lg"><AiFillHome className="text-[12px] text-yellow-600"/> Typically replies within a few hours</div>
        <AiFillHome className="text-[10px]"/><span className="text-[10px]"> Posted on: {project.createdAt}</span>
    </div>
</div>
      <button className="items-center bg-rose-500 justify-center w-full p-2 text-white border border-rose-500 hover:bg-green-100 hover:text-green-500 hover:border-green-600 mb-4"
       
      >
          Show Contact
      </button>
      <button className="items-center text-rose-500 justify-center w-full p-2 bg-white border border-rose-500 hover:bg-green-100 hover:border-green-600">
          Start Chat
      </button>
    </div>
  </div>


  <div className="bg-gray-200 mt-4">
    <div className="bg-white p-5 text-sm border rounded-lg">
      <div className="font-bold text-center text-black">Safety tips</div>
      <ul className="list-disc ml-6 text-black font-normal text-[10px]">
        <li>Dont pay in advance, including for delivery</li>
        <li>Meet the seller at a safe public place</li>
        <li>Inspect the item and ensure its exactly what you want</li>
        <li>On delivery, check that the item delivered is what was inspected</li>
        <li>Only pay when you are satisfied</li>
      </ul>
    </div>
  </div>

  <div className="bg-gray-200 mt-4">
    <div className="bg-white p-5 text-sm border rounded-lg">
    <div className="flex justify-between mt-3">
      <button className="text-blue-500 hover:bg-blue-600 hover:text-white bg-white px-4 py-2 rounded text-[10px] border border-blue-500">
        Mark Unavailable
      </button>
      <button className="text-red-500 hover:bg-red-500 hover:text-white bg-white px-4 py-2 rounded text-[10px] border border-red-500">
           <AiFillHome className="text-[12px] text-red-600"/>  Report Abuse
      </button>
    </div>
    </div>
  </div>

  <div className="bg-gray-200 mt-4">
    <div className="bg-white p-5 text-sm border rounded-lg">
      <button className="items-center text-rose-500 justify-center font-semibold w-full p-2 bg-white border border-rose-500 hover:bg-green-100 hover:border-green-600">
          Post Ad Like This
      </button>
    </div>
  </div>
</div>

      </div>
    </Layout>
  );
}

*/}