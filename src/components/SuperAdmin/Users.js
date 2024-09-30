import { useEffect, useState } from 'react';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase.config';
import Modal from './Modal'; // Assume you have a custom Modal component

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState('All Users');
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList = [];
      querySnapshot.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersList);
      setFilteredUsers(usersList);
    };

    const fetchVerificationRequests = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const requestsList = [];
      querySnapshot.forEach((doc) => {
        requestsList.push({ id: doc.id, ...doc.data() });
      });
      setVerificationRequests(requestsList);
    };

    fetchUsers();
    fetchVerificationRequests();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, users, verificationRequests, selectedTab]);

  const filterUsers = () => {
    let filtered = users.filter(user =>
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedTab === 'Artisans Who Applied For Verification') {
      filtered = filtered.filter(user =>
        verificationRequests.some(request => request.uid === user.uid)
      );
    } else if (selectedTab === 'Pending Artisans') {
      filtered = filtered.filter(user =>
        verificationRequests.some(request => request.uid === user.uid && user.accountType === "Artisan" && request.status === 'Pending')
      );
    } else if (selectedTab === 'Pending Clients') {
      filtered = filtered.filter(user =>
        verificationRequests.some(request => request.uid === user.uid && user.accountType === "Client" && request.status === 'Pending')
      );
    } else if (selectedTab === 'Verified Artisans') {
      filtered = filtered.filter(user =>
        verificationRequests.some(request => request.uid === user.uid && user.accountType === "Artisan" && request.status === 'Verified')
      );
    } else if (selectedTab === 'Verified Clients') {
      filtered = filtered.filter(user =>
        verificationRequests.some(request => request.uid === user.uid && user.accountType === "Client" && request.status === 'Verified')
      );
    } else if (selectedTab === 'Rejected Artisans') {
      filtered = filtered.filter(user =>
        verificationRequests.some(request => request.uid === user.uid && user.accountType === "Artisan" && request.status === 'Rejected')
      );
    } else if (selectedTab === 'Rejected Clients') {
      filtered = filtered.filter(user =>
        verificationRequests.some(request => request.uid === user.uid && user.accountType === "Clients" && request.status === 'Rejected')
      );
    } else if (selectedTab === 'All Artisans') {
      filtered = filtered.filter(user => user.accountType === "Artisan");
    } else if (selectedTab === 'All Clients') {
      filtered = filtered.filter(user => user.accountType === "Client");
    }

    setFilteredUsers(filtered);
  };

  const handleEdit = (user) => {
    if (user.accountType === "Artisan" || user.accountType === "Client") {
      const request = verificationRequests.find(request => request.uid === user.uid);
      if (request) {
        setSelectedRequest(request);
      } else {
        setSelectedRequest(null);
      }
    } else {
      setSelectedRequest(null);
    }
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateRequest = async () => {
    if (selectedRequest) {
      const requestRef = doc(db, 'users', selectedRequest.id);
      await updateDoc(requestRef, selectedRequest);
    }
    setIsEditModalOpen(false);
    setSelectedUser(null);
    setSelectedRequest(null);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <section className="container px-4 mx-auto">
      <div className="flex items-center gap-x-3">
        <h2 className="text-lg font-medium text-gray-800 dark:text-white">All Users</h2>
        <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400 whitespace-nowrap">{users.length} users</span>
      </div>
      <div className="flex mt-6 gap-x-4 w-full overflow-x-auto">
        {['All Users', 'All Artisans', 'All Clients', 'Pending Artisans', 'Verified Artisans', 'Rejected Artisans', 'Pending Clients', 'Verified Clients', 'Rejected Clients'].map(tab => (
          <button
            key={tab}
            className={`px-3 py-1.5 whitespace-nowrap ${selectedTab === tab ? 'text-blue-600 bg-blue-100' : 'text-gray-600 bg-gray-100'} rounded-full`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex flex-col mt-6">
        <div className="relative flex items-center mt-4 md:mt-0">
          <input
            type="text"
            className="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email"
          />
        </div>
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-x-3">
                        <input type="checkbox" className="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700" />
                        <span>Name</span>
                      </div>
                    </th>
                    <th scope="col" className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <button className="flex items-center gap-x-2">
                        <span>Status</span>
                      </button>
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <button className="flex items-center gap-x-2">
                        <span>Role</span>
                      </button>
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Email address</th>
                    <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Actions</th>
                    <th scope="col" className="relative py-3.5 px-4">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                  {currentUsers.map(user => (
                    <tr key={user.id}>
                      <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                        <div className="inline-flex items-center gap-x-3">
                          <input type="checkbox" className="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700" />
                          <div className="flex items-center gap-x-2">
                            <img className="object-cover w-10 h-10 rounded-full" src={user.photoURL || 'default-image-url'} alt="" />
                            <div>
                              <h2 className="font-medium text-gray-800 dark:text-white">{user.displayName}</h2>
                              <p className="text-sm font-normal text-gray-600 dark:text-gray-400">{user.email}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                        <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
                          <span className={`h-1.5 w-1.5 rounded-full ${user.isOnline ? 'bg-emerald-500' : 'bg-gray-500'}`}></span>
                          <h2 className="text-sm font-normal text-emerald-500 dark:text-emerald-400">Active</h2>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{user.accountType}</td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{user.email}</td>
                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(user)}
                          className="px-1 py-1 text-sm font-medium text-gray-500 rounded-md dark:text-gray-300 hover:bg-gray-100"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={handlePreviousPage}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextPage}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to <span className="font-medium">{indexOfLastUser}</span> of <span className="font-medium">{filteredUsers.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={handlePreviousPage}
                        className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">Previous</span>
                        &laquo;
                      </button>
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => handlePageClick(index + 1)}
                          className={`relative inline-flex items-center border ${currentPage === index + 1 ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'} px-4 py-2 text-sm font-medium`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      <button
                        onClick={handleNextPage}
                        className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">Next</span>
                        &raquo;
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isEditModalOpen && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
          <div className="p-4">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Edit Verification Request</h2>
            <div className="mt-4">
              <label className="block text-sm text-gray-700 dark:text-gray-200">Account Type</label>
              <input
                value={selectedRequest?.accountType || ''}
                onChange={(e) => setSelectedRequest({ ...selectedRequest, accountType: e.target.value })}
                className="block p-2 w-full mt-1 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                rows="4"
              />
            </div>
            <div className="flex items-center gap-x-2 my-2">
              <img className="object-cover w-10 h-10 rounded-full" src={selectedRequest?.photoURL || '/images/defaultuser.jpg'} alt="" />
              <div>
                <h2 className="font-medium text-gray-800 dark:text-white">{selectedRequest?.displayName}</h2>
                <p className="text-sm font-normal text-gray-600 dark:text-gray-400">{selectedRequest?.addedBy}</p>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm text-gray-700 dark:text-gray-200">Address</label>
              <input
                value={selectedRequest?.address || ''}
                onChange={(e) => setSelectedRequest({ ...selectedRequest, address: e.target.value })}
                className="block p-2 w-full mt-1 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                rows="4"
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm text-gray-700 dark:text-gray-200">National ID</label>
              <input
                value={selectedRequest?.nationalID || ''}
                onChange={(e) => setSelectedRequest({ ...selectedRequest, nationalID: e.target.value })}
                className="block p-2 w-full mt-1 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                rows="4"
              />
            </div>
              
            <div className="mt-4">
              <label className="block text-sm text-gray-700 dark:text-gray-200">Date Applied</label>
              <input
                value={selectedRequest?.createdAt || ''}
                onChange={(e) => setSelectedRequest({ ...selectedRequest, createdAt: e.target.value })}
                className="block p-2 w-full mt-1 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                rows="4"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm text-gray-700 dark:text-gray-200">Verification Status</label>
              <select
                value={selectedRequest?.status || ''}
                onChange={(e) => setSelectedRequest({ ...selectedRequest, status: e.target.value })}
                className="block w-full mt-1 p-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              >
                <option value="Pending">Pending</option>
                <option value="Verified">Verified</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="mt-4">
              <label className="block text-sm text-gray-700 dark:text-gray-200">Bio</label>
              <textarea
                value={selectedRequest?.bio || ''}
                onChange={(e) => setSelectedRequest({ ...selectedRequest, bio: e.target.value })}
                className="block w-full mt-1 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                rows="4"
              />
            </div>
            <div className="mt-4">
              <button
                onClick={handleUpdateRequest}
                className="px-4 py-2 text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Update
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};

export default Users;
