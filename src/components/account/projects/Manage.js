import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';

const Manage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        const docRef = doc(db, 'users', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser(docSnap.data());
          fetchBookings(docSnap.data().accountType, id);
        } else {
          toast.error('No such user found!');
        }
      }
    };

    const fetchBookings = async (accountType, userId) => {
      let q;
      if (accountType === 'Artisan') {
        q = query(collection(db, 'jobbooking'), where('artisanId', '==', userId));
      } else if (accountType === 'Client') {
        q = query(collection(db, 'jobbooking'), where('clientId', '==', userId));
      }
      const querySnapshot = await getDocs(q);
      setBookings(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };

    fetchUser();

    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto md:py-5 md:px-6 mb-5">
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h1 className="text-4xl font-semibold text-gray-800">
          {user.accountType === 'Artisan' ? 'Job Requests' : 'My Bookings'}
        </h1>
      </div>
      <div className="p-6">
        {bookings.length > 0 ? (
          bookings.map((booking, idx) => (
            <div
              key={idx}
              className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <img
                  src={user.accountType === 'Artisan' ? booking.clientImage : booking.artisanImage}
                  alt={user.accountType === 'Artisan' ? 'Client' : 'Artisan'}
                  className="w-16 h-16 rounded-full object-cover border border-gray-200"
                />
                <div className="ml-4">
                  <p className="text-lg font-semibold text-gray-800">
                    {user.accountType === 'Artisan' ? `Client: ${booking.clientName}` : `Artisan: ${booking.artisanName}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    Booking Date: {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                <strong>Job Details:</strong> {booking.jobDetails}
              </p>
              {booking.feedback && (
                <p className="text-gray-600">
                  <strong>Feedback:</strong> {booking.feedback}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No bookings found.</p>
        )}
      </div>
    </div>
  </div>
  
  );
};

export default Manage;
