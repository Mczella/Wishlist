import React, {useEffect} from 'react'
import {Form} from "./styles/Form";
import {useForm} from "react-hook-form";
import {addDoc, collection} from "firebase/firestore";
import {db} from "./firebase";


const AddNewGift = ({defaultValues}) => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: {errors}} = useForm();
    const recipients = [{name: "xxx"}, {name: "yyy"}]
    const imageUrl = watch('imageUrl');


    const onSubmit = (data) => {
        console.log(data);
        const updatedData = {...data, buyer: "", creator: ""}
        console.log(updatedData)
        addGift(updatedData)
    }

    const addGift = async (data) => {
        const collectionRef = collection(db, "Gifts");
        const docRef = await addDoc(collectionRef, data);
        console.log("A new gift with this ID:" + docRef.id);
    }

    const validateLink = (value) => {
        try {
            new URL(value);
            return true;
        } catch (error) {
            return false;
        }
    };

    useEffect(() => {
        // reset form with user data
        reset(defaultValues);
    }, [defaultValues]);

    return (
        <div>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <label>Název:</label>
                <input {...register('name', {required: true})} />
                {errors.name && <span>This field is required</span>}

                <label>Obrázek:</label>
                {imageUrl && (
                    <img src={imageUrl} alt="Preview" style={{maxWidth: '100%', marginBottom: '1rem'}}/>
                )}
                <input type="text" {...register('imageUrl')} />

                <label>Odkaz:</label>
                <input
                    {...register('link', {
                        required: true,
                        validate: (value) => validateLink(value)
                    })}
                />
                {errors.link?.type === 'required' && <span>This field is required</span>}
                {errors.link?.type === 'validate' && <span>Please enter a valid link</span>
                }

                <label>Pro koho:</label>
                <select {...register('recipient', {required: true})}>
                    <option value="" disabled>
                        Choose recipient
                    </option>
                    {recipients.map((recipient) => (
                        <option key={recipient.name} value={recipient.name}>
                            {recipient.name}
                        </option>
                    ))}
                </select>
                {errors.recipient && <span>This field is required</span>}

                <label>Více informací:</label>
                <textarea {...register('description')} />

                <label>Cena:</label>
                <input type="number" {...register('price', {required: true})} />
                {errors.price && <span>This field is required</span>}

                <div>
                    <button type="submit">Submit</button>
                </div>
            </Form>
        </div>
    );
};

export default AddNewGift;
