import React, {useRef, useState} from 'react'
import {getFunctions, httpsCallable} from "firebase/functions";
import {Form} from "./styles/Form";
import AddNewGift from "./AddNewGift";

const FetchData = () => {
    const [defaultValues, setDefaultValues] = useState({})
    const [link, setLink] = useState("")
    const linkRef = useRef()
    const [error, setError] = useState("")

    const fetchMetaData = async (e) => {
        e.preventDefault()
        try {
            const functions = getFunctions()
            const getMetaData = httpsCallable(functions, 'getMetaData');
            const result = await getMetaData({link: linkRef.current.value})
            const metadata = JSON.parse(result.data.output);
            const ogImage = metadata["twitter:image"] || metadata["og:image"]
            setDefaultValues(
                {
                    name: metadata["og:title"],
                    link: metadata["og:url"],
                    recipient: "Choose recipient",
                    description: metadata["og:description"],
                    price: 0,
                    imageUrl: ogImage

                }
            )
            console.log(defaultValues)
            console.log("url:", metadata["og:url"], "title:", metadata["og:title"], "description:", metadata["og:description"], "image:", metadata[ogImage])
        } catch (error) {
            console.error('Error fetching metadata:', error);
            setError(error)
        }
    };

    return (
        <div>
            <h2>Přidejte nový dárek</h2>
            <Form onSubmit={fetchMetaData}>
                <label>Pro rychlejší vyplnění formuláře vložte odkaz na dárek.</label>
                <input
                    ref={linkRef}
                    type="text"
                    required
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                />

                <button type="submit">Vložit</button>
                {error && <span>Bohužel se nepodařilo načíst data, zkuste to později nebo je zadejte ručně.</span>}
            </Form>
            <AddNewGift defaultValues={defaultValues}/>
        </div>
    )
}

export default FetchData;