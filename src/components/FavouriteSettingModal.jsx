import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MiniPrimaryButton, MiniSecondaryButton } from "./Buttons";

const FavouriteSettingModal = ({ close, categoryId, setFavouriteFetch }) => {
    console.log('bmfolderId: ', categoryId)

    // Vado a pescare il nome della categoria in Redux userProfile
    const { bmfolders } = useSelector(state => state.userProfile);
    const [categoryName, setCategoryName] = useState(null);
    useEffect(() => {
        if (bmfolders) {
            const folderData = bmfolders.find(element => element.id === categoryId);
            setCategoryName(folderData.name);
        }
    }, [bmfolders])

    // Gestisco selezione categoria
    const [selectedCategory, setSelectedCategory] = useState(null);
    useEffect(() => {
        if (categoryName) {
            setSelectedCategory({
                id: categoryId,
                name: categoryName
            })
        }
    }, [categoryName])
    const handleCategorySelect = (event) => {
        const { value } = event.target;
        const selectedOption = event.target.options[event.target.selectedIndex];
        const name = selectedOption.getAttribute('data-name');
        setSelectedCategory({
            id: value,
            name: name
        })
    }
    useEffect(() => {
        console.log('selecetedCategory: ', selectedCategory)
    }, [selectedCategory])

    // Invio fetch cambio categoria:
    const sendData = () => {
        setFavouriteFetch(selectedCategory.id)
        close(false);
    }

    return (
        <div className="absolute right-[-20px] top-[-20px] shadow-2xl rounded-xl border bg-white z-10 flex flex-col items-start gap-4 p-4 text-[12pt] min-w-[500px]">
            <i className="fi fi-sr-circle-xmark cursor-pointer text-xl text-red-800 absolute top-3 right-3" onClick={() => close(false)}></i>

            <h4>Impostazioni preferito</h4>

            {/* Cambia categoria */}

            {
                selectedCategory && <div className={`flex flex-col gap-2 items-start border p-2 w-full`}>
                    <label htmlFor="categoryId">Cambia categoria:</label>
                    <select id="categoryId" onChange={handleCategorySelect} value={selectedCategory.id} /* className={`${selectedField === 0 ? 'pointer-events-none' : ''}`} */ >
                        {
                            bmfolders && bmfolders.map((element, index) => (
                                <option key={index} data-name={element.name} value={element.id} >{element.name}</option>
                            ))
                        }
                    </select>
                </div>
            }

            {
                selectedCategory &&
                <div className="flex flex-col self-end">
            
                        <MiniPrimaryButton text={`Sposta preferito in '${selectedCategory.name}'`} click={sendData}/>
            
                    {/* Elimina dai preferiti */}
                    <MiniSecondaryButton text={`Elimina dai preferiti`} />

                </div>
            }
            



        </div>
    )
}

export default FavouriteSettingModal