import { useEffect, useState } from "react";
import { MiniPrimaryButton } from "./Buttons";


const FavouriteModal = ({ close, isBookmark }) => {
    // Gestisco inserimento nuova categoria
    const [categoryInput, setCategoryInput] = useState(null);
    const handleCategoryInput = (event) => {
        const { value } = event.target;
        setCategoryInput(value)
    }
    useEffect(() => {
        console.log(categoryInput)
    }, [categoryInput])
    return (
        <div className="absolute right-[-20px] top-[-20px] shadow-2xl rounded-xl border bg-white z-10 flex flex-col items-start gap-4 p-4 text-[12pt]">
            <i className="fi fi-sr-circle-xmark cursor-pointer text-xl text-red-800 absolute top-3 right-3" onClick={() => close(false)}></i>
            {!isBookmark && <h4>Aggiungi a preferiti</h4>}
            {isBookmark && <h4>Modifica elemento preferito</h4>}

            <div className="flex flex-col gap-2">

                {/* Aggiungi nuova categoria */}
                <div className="flex flex-col gap-2 items-start">
                    <label htmlFor="name">Aggiungi nuova categoria:</label>
                    <div className="flex gap-2">
                        <input type="text" id="name"  onChange={handleCategoryInput} value={categoryInput} />
                        <div className="border-2 rounded h-[52px] w-[52px] flex justify-center items-center pb-[4px] text-3xl bg-red-800 text-white cursor-pointer">+</div>
                    </div>
                </div>

                {/* Seleziona categoria */}
                <div className="flex flex-col gap-2 items-start">
                    <label htmlFor="categoryId">Seleziona una categoria esistente:</label>
                    <select name="categoryId" id="categoryId">
                        <option value="category1">Categoria 1</option>
                        <option value="category2">Categoria 2</option>
                        <option value="category3">Categoria 3</option>
                    </select>
                </div>
            </div>

            <div className="flex self-end mb-[-10px]">
                <MiniPrimaryButton text="Salva preferito" />
            </div>
        </div>
    )
}

export default FavouriteModal;