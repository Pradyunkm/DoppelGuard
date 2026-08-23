import { UserStory } from '../types/profile';

export const INITIAL_STORIES: UserStory[] = [
  {
    id: 'story_1',
    userId: 'user_1',
    username: 'alex_roberts',
    displayName: 'Alex Roberts',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    hasUnseen: true,
    slides: [
      {
        id: 's1_1',
        mediaUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&auto=format&fit=crop&q=80',
        caption: 'Studio morning light hit just right ✨',
        timestamp: '1h ago',
        durationMs: 5000
      },
      {
        id: 's1_2',
        mediaUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&auto=format&fit=crop&q=80',
        caption: 'Checking prints at the lab today 📸',
        timestamp: '45m ago',
        durationMs: 5000
      }
    ]
  },
  {
    id: 'story_2',
    userId: 'user_2',
    username: 'elena_vance',
    displayName: 'Elena Vance ☕',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    hasUnseen: true,
    slides: [
      {
        id: 's2_1',
        mediaUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1000&auto=format&fit=crop&q=80',
        caption: 'First pour-over of the day. 93°C water, 1:16 ratio ☕',
        timestamp: '3h ago',
        durationMs: 5000
      },
      {
        id: 's2_2',
        mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
        caption: 'Packing for a quiet weekend trip to the coast 🌊',
        timestamp: '2h ago',
        durationMs: 5000
      }
    ]
  },
  {
    id: 'story_3',
    userId: 'user_8',
    username: 'sora_takahashi',
    displayName: 'Sora Takahashi',
    userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
    hasUnseen: true,
    slides: [
      {
        id: 's3_1',
        mediaUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1000&auto=format&fit=crop&q=80',
        caption: 'Rainy Shibuya crosswalk from the 4th floor window 🏮',
        timestamp: '4h ago',
        durationMs: 5000
      }
    ]
  },
  {
    id: 'story_4',
    userId: 'user_10',
    username: 'clara_nordic',
    displayName: 'Clara Lindqvist',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
    hasUnseen: true,
    slides: [
      {
        id: 's4_1',
        mediaUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&auto=format&fit=crop&q=80',
        caption: 'Curating materials for the new townhouse project 📐',
        timestamp: '5h ago',
        durationMs: 5000
      }
    ]
  },
  {
    id: 'story_5',
    userId: 'user_14',
    username: 'liam_wander',
    displayName: 'Liam O’Connor',
    userAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80',
    hasUnseen: true,
    slides: [
      {
        id: 's5_1',
        mediaUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&auto=format&fit=crop&q=80',
        caption: 'Summit push begins at 04:00 AM 🏔️⚡',
        timestamp: '6h ago',
        durationMs: 5000
      }
    ]
  },
  {
    id: 'story_6',
    userId: 'user_13',
    username: 'maya_patel',
    displayName: 'Maya Patel',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    hasUnseen: false,
    slides: [
      {
        id: 's6_1',
        mediaUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&auto=format&fit=crop&q=80',
        caption: 'Dough rising for tomorrow’s morning bake 🌾🥖',
        timestamp: '8h ago',
        durationMs: 5000
      }
    ]
  },
  {
    id: 'story_7',
    userId: 'user_6',
    username: 'novatech_labs',
    displayName: 'NovaTech Labs',
    userAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
    hasUnseen: false,
    slides: [
      {
        id: 's7_1',
        mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80',
        caption: 'Live wafer inspection under electron microscope 🔬',
        timestamp: '10h ago',
        durationMs: 5000
      }
    ]
  }
];
