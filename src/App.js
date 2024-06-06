import { useState } from 'react'
import swal from 'sweetalert'

const initialFriends = [
  {
    id: 118836,
    name: 'Clark',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 20
  },
  {
    id: 499476,
    name: 'Anthony',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0
  }
]

function Button({ action, children }) {
  return (
    <button onClick={action} className="button">
      {children}
    </button>
  )
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends)
  const [showAddFriend, setShowAddFriend] = useState(false)

  function handleToggleShowAddFriend() {
    setShowAddFriend(show => !show)
  }

  function handleAddFriend(newFriend) {
    setFriends(friends => [...friends, newFriend])
    setShowAddFriend(false)
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList friends={friends} />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} onClose={setShowAddFriend} />}
        <Button action={handleToggleShowAddFriend}>{showAddFriend ? 'Close' : 'Add friend'}</Button>
      </div>
      <FormSplitBill />
    </div>
  )
}

function FriendsList({ friends }) {
  return (
    <ul>
      {friends.map(friend => (
        <Friend friend={friend} key={friend.id} />
      ))}
    </ul>
  )
}

function Friend({ friend }) {
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button>Select</Button>
    </li>
  )
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState('')
  const [image, setImage] = useState('https://i.pravatar.cc/48')

  function handleSubmit(e) {
    e.preventDefault()

    const inputName = e.target.querySelector('input#friend-input-name')
    const inputImage = e.target.querySelector('input#friend-input-photo')

    const id = crypto.randomUUID()

    if (!name.trim() || !image.trim()) {
      swal({
        text: 'Please fill all fields in the form to add a friend',
        icon: 'error',
        buttons: {
          cancel: 'Close'
        }
      }).then(function (_) {
        if (!name) {
          inputName.focus()
          return
        }
        if (!image) inputImage.focus()
        setName(name.trim())
        setImage(image.trim())
      })
    } else {
      const newFriend = {
        id,
        name,
        image: `${image}?=${id}`,
        balance: 0
      }
      onAddFriend(newFriend)
      setName('')
      setImage('https://i.pravatar.cc/48')
    }
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label htmlFor="friend-input-name">🧑🏻‍🤝‍👩🏾Friend name</label>
      <input type="text" id="friend-input-name" value={name} onChange={evt => setName(evt.target.value)} />

      <label htmlFor="friend-input-photo">🤳Image URL</label>
      <input type="text" id="friend-input-photo" value={image} onChange={evt => setImage(evt.target.value)} />
      <Button>Add</Button>
    </form>
  )
}

function FormSplitBill() {
  return (
    <form className="form-split-bill">
      <h2>Split a bill with X</h2>

      <label htmlFor="bill-input-value">💰Bill value</label>
      <input type="text" id="bill-input-value" />

      <label htmlFor="bill-your-expense">🧔‍♂️Your expense</label>
      <input type="text" id="bill-your-expense" />

      <label htmlFor="bill-friend-expense">🙆‍♀️X's expense</label>
      <input type="text" id="bill-friend-expense" disabled />

      <label htmlFor="">💸Who is paying the bill</label>
      <select>
        <option value="user">You</option>
        <option value="friend">X</option>
      </select>
      <Button>Add</Button>
    </form>
  )
}
