import {onSnapshot, collection, addDoc, setDoc, doc, getDoc, deleteDoc} from "firebase/firestore";
import {useEffect, useState} from "react";
import {db} from "./firebase";

import {Ul} from "./styles/ul";


export default function GiftStorage() {
    const [gifts, setGifts] = useState([]);
    const [editMode, setEditMode] = useState({});
    const [values, setValues] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
        console.log(values)
    };


    useEffect(
        () =>
            onSnapshot(collection(db, "Gifts"), (snapshot) =>
                setGifts(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
            ),
        []
    );

    const handleEditClick = (itemId) => {
        setEditMode((prevEditMode) => ({
            ...prevEditMode,
            [itemId]: !prevEditMode[itemId],
        }));
    };

    const editGift = async (id) => {
        const docRef = doc(db, "Gifts", id)
        try {
            const docSnap = await getDoc(docRef);
            console.log(docSnap.data());
            const docValues = docSnap.data()
            const newValues = {...docValues, ...values}
            console.log("docValues", docValues)
            console.log("newvalues", newValues)
            await setDoc(docRef, newValues)
        } catch (error) {
            console.log(error)
        }
    }

    const deleteGift = async (id) => {
        const docRef = doc(db, "Gifts", id)
        await deleteDoc(docRef)

    }

    return (
        <div>
            <Ul>
                {gifts.map((gift) => (
                    <li key={gift.id}>
                       <>
                                <h4>Název: {editMode[gift.id] ?
                                    <input
                                        name="name"
                                        defaultValue={gift.name}
                                        onChange={handleInputChange}
                                    /> : gift.name}
                                </h4>
                                {editMode[gift.id] ?
                                   <input
                                       name="imageUrl"
                                       defaultValue={gift.imageUrl || "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="}
                                       onChange={handleInputChange}
                                   /> :
                                <img
                                    src={gift.imageUrl || "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="}
                                    alt={gift.imageUrl ? gift.name : "thumbnail"}
                                />}
                                <a href={gift.link} target="_blank">Prohlédnout v e-shopu</a>
                                <p>Pro: {editMode[gift.id] ?
                                    <input
                                        name="recipient"
                                        defaultValue={gift.recipient}
                                        onChange={handleInputChange}
                                    /> : gift.recipient}
                                </p>
                                <p>Popis: {editMode[gift.id] ?
                                        <input
                                            name="description"
                                            defaultValue={gift.description}
                                            onChange={handleInputChange}
                                        /> : gift.description}
                                </p>
                                <p>Cena: {editMode[gift.id] ?
                                    <input
                                        type="number"
                                        name="price"
                                        defaultValue={gift.price}
                                        onChange={handleInputChange}
                                    /> : gift.price}
                                </p>
                                {/*koupí a vytvořil má vidět pouze owner*/}
                                <p>Kdo koupí: {gift.buyer}</p>
                                <p>Kdo vytvořil: {gift.creator}</p>
                                {/*if user.id === creator or owner*/}
                                {editMode[gift.id] ?
                                <button
                                    className="button"
                                    onClick={() => {
                                        editGift(gift.id);
                                        handleEditClick(gift.id)
                                    }}
                                >
                                    Uložit
                                </button> :
                                <button
                                    className="button"
                                    onClick={() => handleEditClick(gift.id)}
                                >
                                    Upravit
                                </button>
                                }
                               <button
                                   className="button"
                                   onClick={() => deleteGift(gift.id)}
                               >
                                   Smazat
                               </button>
                                </>

                    </li>
                ))}
            </Ul>
        </div>
    );
}