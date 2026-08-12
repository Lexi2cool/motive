import { useState } from 'react'
import { useApp } from '../context/AppContext'

const HEADS = ['😊', '😎', '🤓', '🥳', '🤠', '👻', '🤖', '👽', '🦊', '🐱', '🐶', '🦁']
const BODIES = ['👕', '👗', '🧥', '👘', '🥼', '🦺', '👔', '👗']
const ACCESSORIES = ['none', '👑', '🎩', '🧢', '⛑️', '🎀', '👓', '🕶️']
const BACKGROUNDS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
]

export default function AvatarCustomization() {
  const { state, updateSettings } = useApp()
  const [selectedHead, setSelectedHead] = useState(state.profile?.avatar.head || '😊')
  const [selectedBody, setSelectedBody] = useState(state.profile?.avatar.body || '👕')
  const [selectedAccessory, setSelectedAccessory] = useState(state.profile?.avatar.accessory || 'none')
  const [selectedBackground, setSelectedBackground] = useState(state.profile?.avatar.background || BACKGROUNDS[0])

  const saveAvatar = async () => {
    if (state.profile) {
      await updateSettings({
        avatar: { head: selectedHead, body: selectedBody, accessory: selectedAccessory, background: selectedBackground },
      })
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border-2 border-purple-200/60 shadow-xl shadow-purple-100/50">
      <h3 className="text-xl font-black text-purple-900 mb-4">Avatar Customization</h3>

      <div className="flex justify-center mb-6">
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center text-6xl shadow-lg"
          style={{ background: selectedBackground }}
        >
          <div className="relative">
            {selectedAccessory !== 'none' && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl">
                {selectedAccessory}
              </div>
            )}
            {selectedHead}
            {selectedBody}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-bold text-purple-700 mb-2 block">Head</label>
          <div className="flex flex-wrap gap-2">
            {HEADS.map(head => (
              <button
                key={head}
                onClick={() => setSelectedHead(head)}
                className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                  selectedHead === head ? 'bg-purple-200 ring-2 ring-purple-400' : 'bg-purple-50 hover:bg-purple-100'
                }`}
              >
                {head}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-purple-700 mb-2 block">Body</label>
          <div className="flex flex-wrap gap-2">
            {BODIES.map(body => (
              <button
                key={body}
                onClick={() => setSelectedBody(body)}
                className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                  selectedBody === body ? 'bg-purple-200 ring-2 ring-purple-400' : 'bg-purple-50 hover:bg-purple-100'
                }`}
              >
                {body}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-purple-700 mb-2 block">Accessory</label>
          <div className="flex flex-wrap gap-2">
            {ACCESSORIES.map(acc => (
              <button
                key={acc}
                onClick={() => setSelectedAccessory(acc)}
                className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                  selectedAccessory === acc ? 'bg-purple-200 ring-2 ring-purple-400' : 'bg-purple-50 hover:bg-purple-100'
                }`}
              >
                {acc === 'none' ? '❌' : acc}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-purple-700 mb-2 block">Background</label>
          <div className="flex flex-wrap gap-2">
            {BACKGROUNDS.map(bg => (
              <button
                key={bg}
                onClick={() => setSelectedBackground(bg)}
                className={`w-10 h-10 rounded-xl transition-all ${
                  selectedBackground === bg ? 'ring-2 ring-purple-400 ring-offset-2' : ''
                }`}
                style={{ background: bg }}
              />
            ))}
          </div>
        </div>

        <button
          onClick={saveAvatar}
          className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white py-3 rounded-2xl font-bold shadow-lg shadow-purple-200/50 transition-all"
        >
          Save Avatar
        </button>
      </div>
    </div>
  )
}
