import React from 'react'

export default function SweetCard({sweet, onPurchase}:{sweet:any, onPurchase:(id:string)=>void}){
  return (
    <div className="sweetcard">
      <h3>{sweet.name}</h3>
      <p>Category: {sweet.category}</p>
      <p>Price: ${sweet.price}</p>
      <p>In stock: {sweet.quantity}</p>
      <button disabled={sweet.quantity<=0} onClick={()=>onPurchase(sweet.id)}>Purchase</button>
    </div>
  )
}
