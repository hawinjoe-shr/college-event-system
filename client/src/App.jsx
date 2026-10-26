import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Users, Plus, Search, Trash2, CheckCircle, Eye, UserCheck } from 'lucide-react';

const API_URL = 'https://college-event-backend-three.vercel.app/api/events';

export default function App() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal States
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAttendeesModalOpen, setIsAttendeesModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Form States
  const [regForm, setRegForm] = useState({ name: '', email: '', rollNo: '' });
  const [newEvent, setNewEvent] = useState({
    title: '', category: 'Technical', date: '', location: '', description: '', capacity: 100
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(API_URL);
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, newEvent);
      setIsCreateModalOpen(false);
      setNewEvent({ title: '', category: 'Technical', date: '', location: '', description: '', capacity: 100 });
      fetchEvents();
    } catch (err) {
      alert('Error creating event');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchEvents();
      } catch (err) {
        alert('Error deleting event');
      }
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/${selectedEvent._id}/register`, regForm);
      alert(`Registered successfully for ${selectedEvent.title}!`);
      setIsRegisterModalOpen(false);
      setRegForm({ name: '', email: '', rollNo: '' });
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  const filteredEvents = events.filter(evt => {
    const matchesCategory = selectedCategory === 'All' || evt.category === selectedCategory;
    const matchesSearch = evt.title.toLowerCase().includes(search.toLowerCase()) || 
                          evt.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-12">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
              🎓 CampusEventHub
            </h1>
            <p className="text-xs text-slate-500">College Event Management Portal</p>
          </div>

          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus size={18} /> Create Event
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Search & Category Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {['All', 'Technical', 'Cultural', 'Sports'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedCategory === cat 
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <div key={evt._id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    evt.category === 'Technical' ? 'bg-blue-100 text-blue-700' :
                    evt.category === 'Cultural' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {evt.category}
                  </span>
                  <button onClick={() => handleDeleteEvent(evt._id)} className="text-slate-400 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-2">{evt.title}</h3>
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{evt.description}</p>

                <div className="space-y-2 text-xs text-slate-500 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-indigo-500" />
                    <span>{evt.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-indigo-500" />
                    <span>{evt.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-indigo-500" />
                    <span>{evt.registrationsCount || 0} / {evt.capacity} seats filled</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => { setSelectedEvent(evt); setIsRegisterModalOpen(true); }}
                  className="py-2 bg-indigo-50 text-indigo-600 font-semibold text-xs rounded-lg hover:bg-indigo-600 hover:text-white transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle size={15} /> Register
                </button>

                <button
                  onClick={() => { setSelectedEvent(evt); setIsAttendeesModalOpen(true); }}
                  className="py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-200 transition flex items-center justify-center gap-1.5"
                >
                  <Eye size={15} /> View List ({evt.registeredStudents?.length || 0})
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Admin View Registrations / Attendees Modal */}
      {isAttendeesModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Registered Attendees</h2>
                <p className="text-xs text-indigo-600 font-medium">{selectedEvent.title}</p>
              </div>
              <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                Total: {selectedEvent.registeredStudents?.length || 0}
              </span>
            </div>

            <div className="overflow-y-auto flex-1 border rounded-lg divide-y">
              {selectedEvent.registeredStudents && selectedEvent.registeredStudents.length > 0 ? (
                selectedEvent.registeredStudents.map((student, index) => (
                  <div key={index} className="p-3 text-sm flex justify-between items-center hover:bg-slate-50">
                    <div>
                      <p className="font-semibold text-slate-800">{student.name}</p>
                      <p className="text-xs text-slate-500">{student.email}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded border">
                        ID: {student.rollNo}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-sm">
                  <UserCheck className="mx-auto mb-2 opacity-50" size={32} />
                  No registrations yet for this event.
                </div>
              )}
            </div>

            <button 
              onClick={() => setIsAttendeesModalOpen(false)} 
              className="w-full mt-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Student Register Modal */}
      {isRegisterModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Register for Event</h2>
            <p className="text-sm text-indigo-600 font-medium mb-4">{selectedEvent.title}</p>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                <input required type="text" value={regForm.name} onChange={e => setRegForm({...regForm, name: e.target.value})} className="w-full border p-2 rounded-lg text-sm" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                <input required type="email" value={regForm.email} onChange={e => setRegForm({...regForm, email: e.target.value})} className="w-full border p-2 rounded-lg text-sm" placeholder="john@college.edu" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Roll / Student ID</label>
                <input required type="text" value={regForm.rollNo} onChange={e => setRegForm({...regForm, rollNo: e.target.value})} className="w-full border p-2 rounded-lg text-sm" placeholder="CS2026-042" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsRegisterModalOpen(false)} className="w-full py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium">Cancel</button>
                <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Confirm Registration</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Create Event Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Create New Event</h2>

            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Event Title</label>
                <input required type="text" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full border p-2 rounded-lg text-sm" placeholder="Hackathon 2026" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                  <select value={newEvent.category} onChange={e => setNewEvent({...newEvent, category: e.target.value})} className="w-full border p-2 rounded-lg text-sm">
                    <option>Technical</option>
                    <option>Cultural</option>
                    <option>Sports</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Capacity</label>
                  <input required type="number" value={newEvent.capacity} onChange={e => setNewEvent({...newEvent, capacity: e.target.value})} className="w-full border p-2 rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Date</label>
                <input required type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full border p-2 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Location</label>
                <input required type="text" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} className="w-full border p-2 rounded-lg text-sm" placeholder="Auditorium B" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
                <textarea required rows="3" value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className="w-full border p-2 rounded-lg text-sm" placeholder="Brief event summary..."></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="w-full py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium">Cancel</button>
                <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Save Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}