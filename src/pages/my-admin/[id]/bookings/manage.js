import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../../firebase.config';
import { useRouter } from 'next/router';
import Layout from '../../../../components/SuperAdmin/layout';
import { toast } from 'react-toastify';
import Moment from 'react-moment';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBookings, setFilteredBookings] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    } else {
      setFilteredBookings(bookings);
    }
  }, [searchTerm, bookings]);

  const fetchBookings = async () => {
    try {
      const bookingsCollection = collection(db, 'jobbooking');
      const bookingsSnapshot = await getDocs(bookingsCollection);
      const bookingsList = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(bookingsList);
      setFilteredBookings(bookingsList);
    } catch (error) {
      console.error("Error fetching bookings: ", error);
    }
  };

  const handleSearch = () => {
    const searchLower = searchTerm.toLowerCase();
    const filtered = bookings.filter(booking =>
      booking.artisanId.toLowerCase().includes(searchLower) ||
      booking.artisanName.toLowerCase().includes(searchLower) ||
      booking.clientId.toLowerCase().includes(searchLower) ||
      booking.clientName.toLowerCase().includes(searchLower) ||
      (booking.feedback && booking.feedback.toLowerCase().includes(searchLower))
    );
    setFilteredBookings(filtered);
  };

  const handleDelete = async (bookingId) => {
    try {
      await deleteDoc(doc(db, 'jobbooking', bookingId));
      toast.success('Booking deleted successfully!');
      fetchBookings();
    } catch (error) {
      toast.error('Error deleting booking:', error);
      console.error('Error deleting booking: ', error);
    }
  };

  return (
    <Layout>
      <div className="sm:ml-[81px] xl:ml-[340px] w-[100%] md:w-[70%] lg:w-[70%] xl:w-[75%] h-screen min-h-screen  text-[#16181C] overflow-y-auto no-scrollbar">
       
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Manage Job Bookings</h1>
        <div className="mb-4 flex justify-center">
          <input
            type="text"
            placeholder="Search by artisan ID, artisan name, client ID, client name, or feedback"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full md:max-w-lg mx-2"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b whitespace-nowrap">Artisan ID</th>
                <th className="py-2 px-4 border-b whitespace-nowrap">Artisan Image</th>
                <th className="py-2 px-4 border-b whitespace-nowrap">Artisan Name</th>
                <th className="py-2 px-4 border-b whitespace-nowrap">Client ID</th>
                <th className="py-2 px-4 border-b whitespace-nowrap">Client Image</th>
                <th className="py-2 px-4 border-b whitespace-nowrap">Client Name</th>
                <th className="py-2 px-4 border-b whitespace-nowrap">Created At</th>
                <th className="py-2 px-4 border-b whitespace-nowrap">Feedback</th>
                <th className="py-2 px-4 border-b whitespace-nowrap">Job Details</th>
                <th className="py-2 px-4 border-b whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{booking.artisanId}</td>
                  {booking.artisanImage ? (
                  <td className="py-2 px-4 border-b"><img src={booking.artisanImage} className='w-20 h-20 rounded-full' alt="" /></td>
                  ) : (
                  <td className="py-2 px-4 border-b"><img src='/images/defaultuser.jpg' className='w-20 h-20' alt="" /></td>
                  )}
                  <td className="py-2 px-4 border-b">{booking.artisanName}</td>
                  <td className="py-2 px-4 border-b">{booking.clientId}</td>
                  {booking.clientImage ? (
                  <td className="py-2 px-4 border-b"><img src={booking.clientImage}  className='w-20 h-20 rounded-full' alt="" /></td>
                  ) : (
                  <td className="py-2 px-4 border-b"><img src='/images/defaultuser.jpg' className='w-20 h-20' alt="" /></td>
                  )}
                  <td className="py-2 px-4 border-b">{booking.clientName}</td>
                  <td className="py-2 px-4 border-b"><span className="text-gray-400">Joined on <Moment fromNow>{booking.createdAt && booking.createdAt}</Moment></span></td>
                  <td className="py-2 px-4 border-b">{booking.feedback || 'No feedback'}</td>
                  <td className="py-2 px-4 border-b">{booking.jobDetails}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default ManageBookings;
