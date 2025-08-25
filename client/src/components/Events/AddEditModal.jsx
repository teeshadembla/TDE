import react from "react";

const AddEditModal = ({ formData, handleInputChange, resetForm, handleSubmit, editingEvent, X}) =>{
    return(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto pt-8">
            <div className="bg-white w-full max-w-lg mx-auto mt-8 mb-8 rounded-lg shadow-xl">
              <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-medium">
                      {editingEvent ? 'Edit Event' : 'Add New Event'}
                    </h2>
                    <button
                      onClick={resetForm}
                      className="p-1 hover:bg-gray-100 transition-colors rounded"
                      type="button"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Event Title</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 focus:border-black focus:outline-none transition-colors rounded"
                        placeholder="Enter event title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full p-2 border border-gray-300 focus:border-black focus:outline-none transition-colors resize-vertical rounded"
                        placeholder="Describe your event"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 focus:border-black focus:outline-none transition-colors rounded"
                        placeholder="Event location"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Event Date & Time</label>
                      <input
                        type="datetime-local"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 focus:border-black focus:outline-none transition-colors rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Registration Link</label>
                      <input
                        type="url"
                        name="registrationLink"
                        value={formData.registrationLink}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 focus:border-black focus:outline-none transition-colors rounded"
                        placeholder="https://example.com/register"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Slack Link</label>
                      <input
                        type="url"
                        name="slackLink"
                        value={formData.slackLink}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 focus:border-black focus:outline-none transition-colors rounded"
                        placeholder="https://slack.com/channels/event"
                      />
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                      <button
                        onClick={handleSubmit}
                        className="flex-1 bg-black text-white py-2 px-4 hover:bg-gray-800 transition-colors rounded"
                        type="button"
                      >
                        {editingEvent ? 'Update Event' : 'Create Event'}
                      </button>
                      <button
                        onClick={resetForm}
                        className="flex-1 border border-gray-300 py-2 px-4 hover:bg-gray-50 transition-colors rounded"
                        type="button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        
    )
}

export default AddEditModal;