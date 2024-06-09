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
function Button({ action, onHover, onLeave, children }) {
  return (
    <button onClick={action} className="button" onMouseEnter={onHover} onMouseLeave={onLeave}>
      {children}
    </button>
  )
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends)
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [selectedFriend, setSelectedFriend] = useState(null)
  const [hoverFriendSelectButton, setHoverFriendSelectButton] = useState(false)

  function handleToggleShowAddFriend() {
    setShowAddFriend(show => !show)
  }

  function handleAddFriend(newFriend) {
    setFriends(friends => [...friends, newFriend])
    setShowAddFriend(false)
  }

  function handleSelectFriend(friend) {
    setSelectedFriend(friend)
    setShowAddFriend(false)
  }

  function handleSplitBill(value) {
    setFriends(friends => friends.map(friend => (friend.id === selectedFriend.id ? { ...friend, balance: friend.balance + value } : friend)))
    setSelectedFriend(null)
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList friends={friends} onSelectFriend={handleSelectFriend} selectedFriend={selectedFriend} onSelectHover={setHoverFriendSelectButton} />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} onClose={setShowAddFriend} />}
        <Button action={handleToggleShowAddFriend}>{showAddFriend ? 'Close' : 'Add friend'}</Button>
      </div>
      {selectedFriend && <FormSplitBill key={selectedFriend.id} friend={selectedFriend} hoverFriendSelectButton={hoverFriendSelectButton} onSplitBill={handleSplitBill} />}
    </div>
  )
}

function FriendsList({ friends, selectedFriend, onSelectFriend, onSelectHover }) {
  return (
    <ul>
      {friends.map(friend => (
        <Friend selected={friend.id === selectedFriend?.id} friend={friend} key={friend.id} onSelectFriend={onSelectFriend} onSelectHover={onSelectHover} />
      ))}
    </ul>
  )
}

function Friend({ friend, selected, onSelectFriend, onSelectHover }) {
  return (
    <li className={selected ? 'selected' : ''}>
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
      <Button action={() => onSelectFriend(selected ? null : friend)} onHover={() => onSelectHover(true)} onLeave={() => onSelectHover(false)}>
        {selected ? 'Close' : 'Select'}
      </Button>
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

function FormSplitBill({ friend, hoverFriendSelectButton, onSplitBill }) {
  const [bill, setBill] = useState('')
  const [paidByUser, setPaidByUser] = useState('')
  const paidByFriend = bill - paidByUser < 0 ? '—' : bill - paidByUser
  const [whoIsPaying, setWhoIsPaying] = useState('user')

  function validate(e) {
    if (hoverFriendSelectButton) return
    if (bill <= 0) {
      if (e)
        swal({
          text: `Bill value must be filled with a value greater than zero`,
          buttons: {
            close: 'Close'
          }
        }).then(_ => e?.type !== 'submit' && e?.target.select())
      return false
    }

    if (bill < paidByUser) {
      if (e)
        swal({
          text: `Bill value must be equal or greater than your expense ($${paidByUser})`,
          buttons: {
            close: 'Close'
          }
        }).then(_ => e?.type !== 'submit' && e?.target.select())
      return false
    }

    if (paidByUser < 0) {
      if (e)
        swal({
          text: `Please fill the value you paid with a value greater or equal to 0`,
          buttons: {
            close: 'Close'
          }
        }).then(_ => e?.type !== 'submit' && e?.target.select())
      return false
    }

    if (paidByUser > bill) {
      if (e)
        swal({
          text: `The value you payed must be less or equal than the bill total ($${bill})`,
          buttons: {
            close: 'Close'
          }
        }).then(_ => e?.type !== 'submit' && e?.target.select())
      return false
    }

    return true
  }

  function handleSubmit(e) {
    const isValid = validate()
    e.preventDefault()
    if (!isValid) {
      validate(e)
      return
    }
    onSplitBill(whoIsPaying === 'user' ? paidByFriend : -paidByUser)
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {friend.name}</h2>

      <label htmlFor="bill-input-value">💰Bill value</label>
      <input type="number" min="0" id="bill-input-value" value={bill} onBlur={validate} onChange={e => setBill(Number(e.target.value))} />

      <label htmlFor="bill-your-expense">🧔‍♂️Your expense</label>
      <input type="number" min="0" id="bill-your-expense" value={paidByUser} onBlur={validate} onChange={e => setPaidByUser(Number(e.target.value))} />

      <label htmlFor="bill-friend-expense">🙆‍♀️{friend.name}'s expense</label>
      <input type="text" id="bill-friend-expense" value={paidByFriend} disabled />

      <label htmlFor="">💸Who is paying the bill</label>
      <select value={whoIsPaying} onChange={e => setWhoIsPaying(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{friend.name}</option>
      </select>
      <Button>Add</Button>
    </form>
  )
}
