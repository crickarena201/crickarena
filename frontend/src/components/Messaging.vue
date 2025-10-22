<template>
  <div class="messaging-container">
    <!-- Conversations List -->
    <div class="conversations-panel">
      <div class="panel-header">
        <div class="header-title">
          <div class="title-icon">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </div>
          <h3>Messages</h3>
          <div class="online-indicator"></div>
        </div>
        <div class="header-actions">
          <button @click="showNewConversation = true" class="action-btn new-chat-btn" title="Start New Chat">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
          </button>
          <button v-if="userRole === 'coach' || userRole === 'clubManager'" 
                  @click="createGroupChat" 
                  class="action-btn group-chat-btn"
                  title="Create Group Chat">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m0 0a5.002 5.002 0 0 1 9.75 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
            </svg>
          </button>
          <button @click="manualRefresh" class="action-btn refresh-btn" title="Refresh">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div class="conversations-list">
        <div v-if="loading" class="loading">Loading conversations...</div>
        <div v-else-if="conversations.length === 0" class="no-conversations">
          No conversations yet. Start a new chat!
        </div>
        <div v-else>
          <div v-for="conversation in conversations" 
               :key="conversation._id"
               @click="selectConversation(conversation)"
               :class="['conversation-item', { 
                 active: selectedConversation?._id === conversation._id,
                 'has-unread': getUnreadCount(conversation) > 0
               }]">
            <div class="conversation-avatar">
              <div class="avatar-container">
                <div v-if="conversation.type === 'group'" class="group-avatar">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m0 0a5.002 5.002 0 0 1 9.75 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                  </svg>
                </div>
                <div v-else class="direct-avatar">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <div v-if="getUnreadCount(conversation) > 0" class="unread-indicator"></div>
              </div>
            </div>
            <div class="conversation-info">
              <div class="conversation-header">
                <div class="conversation-name">
                  {{ getConversationName(conversation) }}
                </div>
                <div class="conversation-meta">
                  <span class="last-message-time">
                    {{ formatTime(conversation.lastMessage?.timestamp) }}
                  </span>
                  <span v-if="getUnreadCount(conversation) > 0" class="unread-badge">
                    {{ getUnreadCount(conversation) > 99 ? '99+' : getUnreadCount(conversation) }}
                  </span>
                </div>
              </div>
              <div class="last-message">
                <span v-if="conversation.lastMessage?.sender" class="sender-name">
                  {{ conversation.lastMessage.sender.name }}:
                </span>
                {{ conversation.lastMessage?.content || 'No messages yet' }}
              </div>
              <div v-if="conversation.type === 'group'" class="conversation-participants">
                {{ conversation.participants?.length || 0 }} members
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Messages Panel -->
    <div class="messages-panel">
      <div v-if="!selectedConversation" class="no-selection">
        <div class="no-selection-icon">
          <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        </div>
        <h3>Welcome to Team Chat</h3>
        <p>Select a conversation to start messaging with your team</p>
        <div class="quick-actions">
          <button @click="showNewConversation = true" class="quick-action-btn">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Start New Chat
          </button>
        </div>
      </div>
      
      <div v-else class="messages-container">
        <div class="messages-header">
          <div class="header-left">
            <div class="conversation-avatar-header">
              <div v-if="selectedConversation.type === 'group'" class="group-avatar-header">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m0 0a5.002 5.002 0 0 1 9.75 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                </svg>
              </div>
              <div v-else class="direct-avatar-header">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
            </div>
            <div class="header-info">
              <h3>{{ getConversationName(selectedConversation) }}</h3>
              <div class="conversation-status">
                <span v-if="selectedConversation.type === 'group'" class="status-text">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m0 0a5.002 5.002 0 0 1 9.75 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                  </svg>
                  {{ selectedConversation.participants?.length || 0 }} members
                </span>
                <span v-else class="status-text">
                  <div class="online-dot"></div>
                  Direct Message
                </span>
              </div>
              <div v-if="selectedConversation.type === 'group' && selectedConversation.reason" class="group-reason">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ selectedConversation.reason }}
              </div>
            </div>
          </div>
          <div class="header-actions">
            <button class="header-action-btn" title="Conversation Info">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </button>
            <button 
              v-if="(userRole === 'coach' || userRole === 'clubManager') && selectedConversation.type === 'group'"
              @click="deleteConversation(selectedConversation._id)"
              class="header-action-btn delete-btn" 
              title="Delete Group Chat">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="messages-list" ref="messagesList">
          <div v-if="messagesLoading" class="loading">Loading messages...</div>
          <div v-else>
            <div v-for="(message, index) in messages" 
                 :key="message._id"
                 :class="['message-wrapper', { 'own-message': message.sender._id === currentUserId }]">
              <div v-if="shouldShowDateSeparator(index)" class="date-separator">
                <span class="date-text">{{ formatDate(message.createdAt) }}</span>
              </div>
              <div class="message">
                <div v-if="message.sender._id !== currentUserId" class="message-avatar">
                  <div class="sender-avatar">
                    {{ message.sender.name?.charAt(0)?.toUpperCase() || 'U' }}
                  </div>
                </div>
                <div class="message-content">
                  <div v-if="message.sender._id !== currentUserId && selectedConversation.type === 'group'" class="message-sender">
                    {{ message.sender.name }}
                  </div>
                  <div class="message-bubble">
                    <div class="message-text">{{ message.content }}</div>
                    <div class="message-meta">
                      <span class="message-time">{{ formatTime(message.createdAt) }}</span>
                      <div v-if="message.sender._id === currentUserId" class="message-status">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="message-input-container">
          <div class="input-wrapper">
            <div class="input-field-container">
              <textarea 
                v-model="newMessage"
                @keydown.enter.prevent="sendMessage"
                @input="adjustTextareaHeight"
                ref="messageInput"
                placeholder="Type your message..."
                class="message-input"
                rows="1"
              ></textarea>
              <div v-if="newMessage.trim()" class="typing-indicator">
                <span class="char-count">{{ newMessage.length }}/5000</span>
              </div>
            </div>
            <div class="input-actions-right">
              <button 
                @click="sendMessage" 
                :disabled="!newMessage.trim()" 
                :class="['send-btn', { 'active': newMessage.trim() }]"
                title="Send Message">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Conversation Modal -->
    <div v-if="showNewConversation" class="modal-overlay" @click.self="showNewConversation = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Start New Conversation</h3>
          <button @click="showNewConversation = false" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div v-if="loadingMembers" class="loading">Loading club members...</div>
          <div v-else class="members-list">
            <div v-for="member in clubMembers" 
                 :key="member._id"
                 @click="startDirectConversation(member._id)"
                 class="member-item">
              <div class="member-avatar">
                <i class="fas fa-user"></i>
              </div>
              <div class="member-info">
                <div class="member-name">{{ member.name }}</div>
                <div class="member-role">{{ member.type }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Group Chat Creation Modal -->
    <div v-if="showGroupChatModal" class="modal-overlay" @click.self="showGroupChatModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Create Group Chat</h3>
          <button @click="showGroupChatModal = false" class="close-btn">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitGroupChat" class="group-chat-form">
            <div class="form-group">
              <label for="groupName" class="form-label">Group Name (Optional)</label>
              <input 
                id="groupName"
                v-model="groupChatForm.name"
                type="text"
                class="form-input"
                placeholder="Enter group name (leave empty for default)"
                maxlength="50"
              />
            </div>
            
            <div class="form-group">
              <label for="groupReason" class="form-label">Reason for Creating Group <span class="required">*</span></label>
              <textarea 
                id="groupReason"
                v-model="groupChatForm.reason"
                class="form-textarea"
                placeholder="Explain why you're creating this group chat (e.g., Match preparation, Training coordination, Tournament discussion)"
                rows="4"
                maxlength="200"
                required
              ></textarea>
              <div class="char-counter">{{ groupChatForm.reason.length }}/200</div>
            </div>
            
            <div class="form-actions">
              <button type="button" @click="showGroupChatModal = false" class="btn-secondary">
                Cancel
              </button>
              <button type="submit" class="btn-primary" :disabled="!groupChatForm.reason.trim()">
                Create Group Chat
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue';
import { useAuthStore } from '../store/auth';
import axios from 'axios';

export default {
  name: 'Messaging',
  setup() {
    const auth = useAuthStore();
    const conversations = ref([]);
    const selectedConversation = ref(null);
    const messages = ref([]);
    const newMessage = ref('');
    const loading = ref(false);
    const messagesLoading = ref(false);
    const showNewConversation = ref(false);
    const clubMembers = ref([]);
    const loadingMembers = ref(false);
    const messagesList = ref(null);
    
    const currentUserId = computed(() => auth.userProfile?._id || auth.user?._id);
    const userRole = computed(() => auth.userProfile?.role || auth.user?.role);
    const API_URL = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
    
    // Polling interval for new messages
    let messagePollingInterval = null;
    
    const fetchConversations = async (showLoading = true) => {
      if (showLoading) loading.value = true;
      try {
        const response = await axios.get(`${API_URL}/messages/conversations`, { withCredentials: true });
        conversations.value = response.data;
        console.log('Fetched conversations:', response.data.map(conv => ({
          id: conv._id,
          type: conv.type,
          name: conv.name
        })));
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        if (showLoading) loading.value = false;
      }
    };
    
    const fetchClubMembers = async () => {
      loadingMembers.value = true;
      try {
        const response = await axios.get(`${API_URL}/messages/club-members`, { withCredentials: true });
        clubMembers.value = response.data;
      } catch (error) {
        console.error('Error fetching club members:', error);
      } finally {
        loadingMembers.value = false;
      }
    };
    
    const selectConversation = async (conversation) => {
      selectedConversation.value = conversation;
      await fetchMessages();
      startMessagePolling();
    };
    
    const fetchMessages = async () => {
      if (!selectedConversation.value) return;
      
      messagesLoading.value = true;
      try {
        const response = await axios.get(
          `${API_URL}/messages/conversations/${selectedConversation.value._id}/messages`,
          { withCredentials: true }
        );
        messages.value = response.data.messages;
        await nextTick();
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        messagesLoading.value = false;
      }
    };
    
    const sendMessage = async () => {
      if (!newMessage.value.trim() || !selectedConversation.value) return;
      
      const messageContent = newMessage.value.trim();
      newMessage.value = '';
      
      try {
        const response = await axios.post(
          `${API_URL}/messages/conversations/${selectedConversation.value._id}/messages`,
          { content: messageContent },
          { withCredentials: true }
        );
        messages.value.push(response.data);
        await nextTick();
        scrollToBottom();
        
        // Update conversation's last message
        const convIndex = conversations.value.findIndex(c => c._id === selectedConversation.value._id);
        if (convIndex !== -1) {
          conversations.value[convIndex].lastMessage = {
            content: messageContent,
            sender: response.data.sender,
            timestamp: response.data.createdAt
          };
        }
      } catch (error) {
        console.error('Error sending message:', error);
        newMessage.value = messageContent; // Restore message on error
      }
    };
    
    const startDirectConversation = async (recipientId) => {
      try {
        const response = await axios.post(
          `${API_URL}/messages/conversations/direct`,
          { recipientId },
          { withCredentials: true }
        );
        selectedConversation.value = response.data;
        showNewConversation.value = false;
        await fetchConversations();
        await fetchMessages();
      } catch (error) {
        console.error('Error starting conversation:', error);
      }
    };
    
    const showGroupChatModal = ref(false);
    const groupChatForm = ref({
      name: '',
      reason: ''
    });

    const createGroupChat = () => {
      showGroupChatModal.value = true;
      groupChatForm.value = {
        name: '',
        reason: ''
      };
    };

    const submitGroupChat = async () => {
      if (!groupChatForm.value.reason.trim()) {
        window.$notify?.warning('Missing Information', 'Please provide a reason for creating this group chat');
        return;
      }

      try {
        const response = await axios.post(
          `${API_URL}/messages/conversations/group`,
          { 
            name: groupChatForm.value.name.trim() || null,
            reason: groupChatForm.value.reason.trim()
          },
          { withCredentials: true }
        );
        selectedConversation.value = response.data;
        showGroupChatModal.value = false;
        await fetchConversations();
        await fetchMessages();
        window.$notify?.success('Group Chat Created', 'Your group chat has been created successfully!');
      } catch (error) {
        console.error('Error creating group chat:', error);
        const errorMessage = error.response?.data?.message || 'Error creating group chat. Please try again.';
        window.$notify?.error('Creation Failed', errorMessage);
      }
    };

    const deleteConversation = async (conversationId) => {
      if (!conversationId) {
        window.$notify?.error('Invalid Request', 'Invalid conversation ID');
        return;
      }

      const confirmed = await window.$confirm({
        title: 'Delete Group Chat',
        message: 'Are you sure you want to delete this conversation? This action cannot be undone and all messages will be permanently lost.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        isDangerous: true
      });

      if (!confirmed) {
        return;
      }

      try {
        console.log('Attempting to delete conversation:', {
          conversationId,
          type: typeof conversationId,
          selectedConversation: selectedConversation.value,
          allConversations: conversations.value.map(c => ({ id: c._id, name: c.name }))
        });
        
        const response = await axios.delete(`${API_URL}/messages/conversations/${conversationId}`, { withCredentials: true });
        console.log('Delete response:', response.data);
        
        // If the deleted conversation was selected, clear selection
        if (selectedConversation.value?._id === conversationId) {
          selectedConversation.value = null;
          messages.value = [];
          stopMessagePolling();
        }
        
        await fetchConversations();
        window.$notify?.success('Conversation Deleted', 'The group chat has been deleted successfully!');
      } catch (error) {
        console.error('Error deleting conversation:', error);
        
        let errorTitle = 'Deletion Failed';
        let errorMessage = 'Error deleting conversation. Please try again.';
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.status === 403) {
          errorTitle = 'Permission Denied';
          errorMessage = 'You do not have permission to delete this conversation.';
        } else if (error.response?.status === 404) {
          errorTitle = 'Not Found';
          errorMessage = 'Conversation not found.';
        }
        
        window.$notify?.error(errorTitle, errorMessage);
      }
    };
    
    const getConversationName = (conversation) => {
      if (conversation.type === 'group') {
        return conversation.name || 'Group Chat';
      } else {
        // For direct messages, show the other participant's name
        const otherParticipant = conversation.participants.find(
          p => p.user._id !== currentUserId.value
        );
        return otherParticipant?.user.name || 'Unknown User';
      }
    };
    
    const getUnreadCount = (conversation) => {
      const participant = conversation.participants.find(
        p => p.user._id === currentUserId.value
      );
      return participant?.unreadCount || 0;
    };
    
    const formatTime = (timestamp) => {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    };
    
    const formatDate = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };
    
    const shouldShowDateSeparator = (index) => {
      if (index === 0) return true;
      const currentDate = new Date(messages.value[index].createdAt).toDateString();
      const previousDate = new Date(messages.value[index - 1].createdAt).toDateString();
      return currentDate !== previousDate;
    };
    
    const scrollToBottom = () => {
      if (messagesList.value) {
        messagesList.value.scrollTop = messagesList.value.scrollHeight;
      }
    };
    
    const startMessagePolling = () => {
      stopMessagePolling();
      messagePollingInterval = setInterval(fetchMessages, 15000); // Poll every 15 seconds instead of 5
    };
    
    const stopMessagePolling = () => {
      if (messagePollingInterval) {
        clearInterval(messagePollingInterval);
        messagePollingInterval = null;
      }
    };
    
    const adjustTextareaHeight = () => {
      const textarea = messageInput.value;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
      }
    };
    
    const messageInput = ref(null);
    
    // Polling intervals
    let conversationPollingInterval = null;
    
    const startConversationPolling = () => {
      stopConversationPolling();
      conversationPollingInterval = setInterval(() => fetchConversations(false), 30000); // Poll every 30 seconds without loading state
    };
    
    const stopConversationPolling = () => {
      if (conversationPollingInterval) {
        clearInterval(conversationPollingInterval);
        conversationPollingInterval = null;
      }
    };
    
    const manualRefresh = async () => {
      await fetchConversations(true);
      if (selectedConversation.value) {
        await fetchMessages();
      }
    };
    
    onMounted(() => {
      fetchConversations();
      fetchClubMembers();
      
      // Start polling for conversations
      startConversationPolling();
    });
    
    // Cleanup on unmount
    onUnmounted(() => {
      stopMessagePolling();
      stopConversationPolling();
    });
    
    return {
      conversations,
      selectedConversation,
      messages,
      newMessage,
      loading,
      messagesLoading,
      showNewConversation,
      clubMembers,
      loadingMembers,
      messagesList,
      messageInput,
      currentUserId,
      userRole,
      fetchConversations,
      selectConversation,
      sendMessage,
      startDirectConversation,
      createGroupChat,
      getConversationName,
      getUnreadCount,
      formatTime,
      formatDate,
      shouldShowDateSeparator,
      adjustTextareaHeight,
      manualRefresh,
      showGroupChatModal,
      groupChatForm,
      submitGroupChat,
      deleteConversation
    };
  }
};
</script>

<style scoped>
.messaging-container {
  display: flex;
  height: calc(100vh - 120px);
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.conversations-panel {
  width: 380px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 24px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.title-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.header-title h3 {
  margin: 0;
  color: #1e293b;
  font-size: 20px;
  font-weight: 700;
  flex: 1;
}

.online-indicator {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;
}

.action-btn:hover {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -8px rgba(99, 102, 241, 0.6);
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.conversation-item {
  display: flex;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 16px;
  margin-bottom: 4px;
  position: relative;
}

.conversation-item:hover {
  background: rgba(99, 102, 241, 0.08);
  transform: translateX(4px);
}

.conversation-item.active {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%);
  border: 1px solid rgba(99, 102, 241, 0.2);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
}

.conversation-item.has-unread {
  background: rgba(16, 185, 129, 0.05);
  border-left: 3px solid #10b981;
}

.conversation-avatar {
  margin-right: 16px;
  position: relative;
}

.avatar-container {
  position: relative;
}

.group-avatar,
.direct-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.unread-indicator {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  background: #ef4444;
  border-radius: 50%;
  border: 2px solid white;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-3px); }
  60% { transform: translateY(-2px); }
}

.conversation-info {
  flex: 1;
  min-width: 0;
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
}

.conversation-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 16px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

.conversation-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.last-message-time {
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
}

.unread-badge {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
}

.last-message {
  color: #64748b;
  font-size: 14px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 4px;
}

.sender-name {
  color: #6366f1;
  font-weight: 600;
  margin-right: 4px;
}

.conversation-participants {
  color: #94a3b8;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.messages-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
}

.no-selection {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
}

.no-selection-icon {
  margin-bottom: 24px;
  color: #cbd5e1;
  opacity: 0.7;
}

.no-selection h3 {
  color: #1e293b;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 12px 0;
}

.no-selection p {
  color: #64748b;
  font-size: 16px;
  margin: 0 0 24px 0;
  max-width: 300px;
  line-height: 1.5;
}

.quick-actions {
  display: flex;
  gap: 12px;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.quick-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
}

.messages-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.messages-header {
  padding: 24px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.05) 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.conversation-avatar-header {
  position: relative;
}

.group-avatar-header,
.direct-avatar-header {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.header-info h3 {
  margin: 0 0 4px 0;
  color: #1e293b;
  font-size: 20px;
  font-weight: 700;
}

.conversation-status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-text {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

.online-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.header-action-btn {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;
}

.header-action-btn:hover {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -8px rgba(99, 102, 241, 0.6);
}

.delete-btn:hover {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
  color: white !important;
  box-shadow: 0 8px 25px -8px rgba(239, 68, 68, 0.6) !important;
}

.group-reason {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6366f1;
  font-size: 13px;
  font-weight: 500;
  margin-top: 4px;
  padding: 4px 8px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 8px;
  border-left: 3px solid #6366f1;
}

.messages-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  scroll-behavior: smooth;
}

.messages-list::-webkit-scrollbar {
  width: 6px;
}

.messages-list::-webkit-scrollbar-track {
  background: transparent;
}

.messages-list::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.5);
  border-radius: 3px;
}

.messages-list::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.7);
}

.date-separator {
  text-align: center;
  margin: 24px 0;
  position: relative;
}

.date-text {
  background: rgba(255, 255, 255, 0.9);
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 16px;
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.message-wrapper {
  margin-bottom: 16px;
}

.message-wrapper.own-message {
  display: flex;
  justify-content: flex-end;
}

.message {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  max-width: 70%;
}

.own-message .message {
  flex-direction: row-reverse;
}

.message-avatar {
  flex-shrink: 0;
}

.sender-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 12px;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-sender {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #6366f1;
}

.message-bubble {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 18px;
  padding: 12px 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  position: relative;
}

.own-message .message-bubble {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
}

.own-message .message-bubble::before {
  content: '';
  position: absolute;
  top: 50%;
  right: -6px;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid #6366f1;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
}

.message-bubble::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -6px;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-right: 8px solid rgba(255, 255, 255, 0.95);
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
}

.own-message .message-bubble::before {
  border-right: none;
  border-left: 8px solid #6366f1;
  left: auto;
  right: -6px;
}

.message-text {
  line-height: 1.5;
  word-wrap: break-word;
  margin-bottom: 8px;
}

.message-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.message-time {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
}

.own-message .message-time {
  color: rgba(255, 255, 255, 0.8);
}

.message-status {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.8);
}

.message-input-container {
  padding: 20px 24px;
  border-top: 1px solid rgba(226, 232, 240, 0.6);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  background: rgba(248, 250, 252, 0.8);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 20px;
  padding: 8px;
  transition: all 0.2s ease;
}

.input-wrapper:focus-within {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.input-actions-right {
  display: flex;
  gap: 4px;
}

.input-field-container {
  flex: 1;
  position: relative;
}

.message-input {
  width: 100%;
  min-height: 40px;
  max-height: 120px;
  padding: 8px 12px;
  border: none;
  background: transparent;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  color: #1e293b;
  outline: none;
}

.message-input::placeholder {
  color: #94a3b8;
}

.typing-indicator {
  position: absolute;
  bottom: -20px;
  right: 8px;
  font-size: 11px;
  color: #94a3b8;
}

.char-count {
  font-weight: 500;
}

.send-btn {
  width: 40px;
  height: 40px;
  background: rgba(148, 163, 184, 0.3);
  color: #94a3b8;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  transform: scale(0.9);
}

.send-btn.active {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  transform: scale(1);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.send-btn.active:hover {
  transform: scale(1.05) translateY(-1px);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: scale(0.9);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  width: 500px;
  max-height: 600px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%);
  border-radius: 20px 20px 0 0;
}

.modal-header h3 {
  margin: 0;
  color: #1e293b;
  font-size: 20px;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: #64748b;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.member-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.member-item:hover {
  background: rgba(99, 102, 241, 0.08);
  border-color: rgba(99, 102, 241, 0.2);
  transform: translateX(4px);
}

.member-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 16px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.member-info {
  flex: 1;
}

.member-name {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
  font-size: 16px;
}

.member-role {
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

.loading {
  text-align: center;
  padding: 40px 20px;
  color: #64748b;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loading::before {
  content: '';
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-conversations {
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.no-conversations::before {
  content: '💬';
  font-size: 48px;
  opacity: 0.5;
}

/* Group Chat Form Styles */
.group-chat-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
}

.required {
  color: #ef4444;
}

.form-input,
.form-textarea {
  padding: 12px 16px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  background: rgba(248, 250, 252, 0.8);
  transition: all 0.2s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  background: white;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.char-counter {
  font-size: 12px;
  color: #64748b;
  text-align: right;
  margin-top: 4px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: rgba(148, 163, 184, 0.1);
  color: #64748b;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.btn-secondary:hover {
  background: rgba(148, 163, 184, 0.2);
  color: #475569;
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .messaging-container {
    flex-direction: column;
    height: calc(100vh - 80px);
    border-radius: 16px;
  }
  
  .conversations-panel {
    width: 100%;
    height: 40%;
    border-right: none;
    border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  }
  
  .messages-panel {
    height: 60%;
  }
  
  .panel-header {
    padding: 16px;
  }
  
  .header-title h3 {
    font-size: 18px;
  }
  
  .conversation-item {
    padding: 12px 16px;
  }
  
  .messages-header {
    padding: 16px;
  }
  
  .messages-list {
    padding: 16px;
  }
  
  .message-input-container {
    padding: 16px;
  }
  
  .modal-content {
    width: 90%;
    max-width: 400px;
    margin: 20px;
  }
  
  .input-wrapper {
    gap: 8px;
    padding: 6px;
  }
  
  .send-btn {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 480px) {
  .conversations-panel {
    width: 320px;
  }
  
  .conversation-name {
    max-width: 140px;
  }
  
  .message {
    max-width: 85%;
  }
}
</style>
