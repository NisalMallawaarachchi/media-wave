import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaImages, 
  FaUsers, 
  FaEnvelope, 
  FaUpload, 
  FaChartLine,
  FaArrowRight,
  FaSearch
} from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalMedia: 0,
    totalUsers: 0,
    unreadMessages: 0,
    recentUploads: []
  });
   const [media, setMedia] = useState([]); // Changed from recentUploads to media
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch actual data from your API
 useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsResponse = await fetch('/api/dashboard/stats');
      const statsData = await statsResponse.json();
      
      // Fetch media - ensure this matches your backend route
      const mediaResponse = await fetch('/api/upload/all?limit=5');
      const mediaData = await mediaResponse.json();

      console.log('API Responses:', { statsData, mediaData }); // Debug log

      if (statsData.success && mediaData.success) {
        setStats({
          totalMedia: statsData.data?.totalMedia || 0,
          totalUsers: statsData.data?.totalUsers || 0,
          unreadMessages: statsData.data?.unreadMessages || 0
        });
        setMedia(mediaData.data || []); // Ensure we always have an array
      }
    } catch (error) {
      console.error("Full error details:", {
        error: error.message,
        stack: error.stack
      });
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

  // Filter images based on search term
  const filteredUploads = media.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-indigo-700">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your media gallery.</p>
        </div>

        {/* Stats Cards - Display actual stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4 border border-gray-100">
            <FaImages className="text-indigo-600 text-3xl" />
            <div>
              <h3 className="text-lg font-bold text-indigo-700">Total Media</h3>
              <p className="text-2xl font-semibold">{stats.totalMedia}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4 border border-gray-100">
            <FaUsers className="text-indigo-600 text-3xl" />
            <div>
              <h3 className="text-lg font-bold text-indigo-700">Total Users</h3>
              <p className="text-2xl font-semibold">{stats.totalUsers}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4 border border-gray-100">
            <FaEnvelope className="text-indigo-600 text-3xl" />
            <div>
              <h3 className="text-lg font-bold text-indigo-700">Unread Messages</h3>
              <p className="text-2xl font-semibold">{stats.unreadMessages}</p>
            </div>
          </div>
        </div>

        {/* Recent Uploads Section - Updated with Image Gallery */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <h2 className="text-xl font-bold text-indigo-700">Recent Uploads</h2>
            
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search images or tags..."
                  className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500'}`}
                  title="Grid view"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500'}`}
                  title="List view"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              
              <Link 
                to="/upload" 
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FaUpload className="mr-2" /> Upload New
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                // Grid View
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredUploads.map((item) => (
                    <div key={item.id} className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      <img
                        src={item.url}
                        alt={item.title || 'Uploaded media'}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <div className="text-white">
                          <h3 className="font-medium truncate">{item.title}</h3>
                          <p className="text-xs opacity-80">{item.date}</p>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Link
                          to={`/media/${item.id}`}
                          className="p-1 bg-white/80 rounded-full text-indigo-600 hover:bg-white transition"
                          title="View"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <Link
                          to={`/media/${item.id}/edit`}
                          className="p-1 bg-white/80 rounded-full text-indigo-600 hover:bg-white transition"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // List View
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUploads.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <img
                              src={item.url}
                              alt={item.title}
                              className="h-12 w-12 rounded object-cover"
                              loading="lazy"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {item.tags.map(tag => (
                                <span key={tag} className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Link 
                              to={`/media/${item.id}`} 
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              View
                            </Link>
                            <Link 
                              to={`/media/${item.id}/edit`} 
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {filteredUploads.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500">
              <p>No images found matching your search.</p>
            </div>
          )}
        </div>

        {/* Activity Chart (unchanged from your original) */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
           {/* Activity Chart (Placeholder) */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-indigo-700 mb-6">Upload Activity</h2>
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
            <div className="text-center text-gray-500">
              <FaChartLine size={48} className="mx-auto mb-4 text-indigo-300" />
              <p>Media upload activity chart will be displayed here</p>
              <p className="text-sm mt-2">(Integration with charting library would go here)</p>
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}