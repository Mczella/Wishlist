import {addDoc, deleteDoc, doc, getDoc, setDoc, collection} from "firebase/firestore"
import {db} from "./firebase"


export const handleEdit = async (id, collection, values) => {
    const docRef = doc(db, collection, id)
        const docSnap = await getDoc(docRef)
        console.log(docSnap.data())
        const docValues = docSnap.data()
        const newValues = {...docValues, ...values}
        console.log("docValues", docValues)
        console.log("newValues", newValues)
        await setDoc(docRef, newValues)
}

export const handleDelete = async (id, collection) => {
    const docRef = doc(db, collection, id)
    await deleteDoc(docRef)

}

export const handleAdd = async (data, collectionName) => {
    const collectionRef = collection(db, collectionName)
    const docRef = await addDoc(collectionRef, data)
    console.log("A new item with this ID:" + docRef.id)
}