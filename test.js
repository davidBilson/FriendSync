import style from './AddProduct.module.css'
import {useState, useEffect} from 'react'
import logoSmall from '../../../assets/images/logoSmall.png';
import {RiCloseCircleFill} from 'react-icons/ri'
import {BsToggleOff, BsToggleOn} from 'react-icons/bs'
import axios from 'axios'
import {addWeeks, startOfWeek, format} from 'date-fns'

const AddProduct = ({setShowAddProduct, toast, fetchData}) => {

    const [formData, setFormData] = useState({
        name: '',
        productId: '',
        price: 0,
        quantity: 0,
        frequency: 0,
        order: false
    });

    const [userId, setUserId] = useState('');

    useEffect(() => {
        const id = window.sessionStorage.getItem('userId')
        setUserId(id)
      },[])

    const [showFrequency, setShowFrequency] = useState(true)

    function toggleFrequency() {
        setShowFrequency(!showFrequency)
    }

    function handleClose(e) {
        if (e.target.id === 'modalBackgroundGlass') {
            setShowAddProduct(false);
        }
    }

function handleChange(e) {
    setFormData(prevFormData => {
        return {
            ...prevFormData,
            [e.target.name]: e.target.value,
        }
    })
}

const currentDay = format(startOfWeek(new Date(), { weekStartsOn: 0 }), 'y-MM-dd');

const reorderReminderDay = format(startOfWeek(addWeeks(startOfWeek(new Date(), { weekStartsOn: 0 }), formData.frequency)), 'y-MM-dd')

const handleSubmit = async (e) => {
    e.preventDefault()
    
    const name = formData.name
    const productId = formData.productId
    const price = formData.price
    const quantity = formData.quantity
    const frequency = formData.frequency
    const order = formData.order
    const currentWeek = currentDay
    const reorderReminderWeek = reorderReminderDay

    if (quantity === 0 || price === 0) {
      alert("price & quantity must be greater than zero")
      return;
    }

    try {
        const res = await axios.post('https://odd-gold-anemone-cap.cyclic.app/products/createProduct', {
            name, 
            productId, 
            price, 
            quantity, 
            frequency, 
            originalFrequency: frequency, 
            userId, 
            order, 
            currentWeek, 
            reorderReminderWeek
        })

        if (res.request.status === 200) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                name: '',
                productId: '',
                price: 0,
                quantity: 0,
                frequency: 0
              }))
            //   fetchdata is used to rerender this one particular component to not have to refresh the whole page - component did update lifecycle
              fetchData()
              setShowAddProduct(false)
              toast.success('Successfully added product', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
        } else {
            toast.error('Error adding product', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
        }  
    } catch (err) {
        console.error(err)
    }
}

  return (
    <>
        <section
            id='modalBackgroundGlass'
            onClick={handleClose}
            className={style.addProductFormSection}
        >
            <div  
                className={style.addProductFormIconContainer}>
                    <RiCloseCircleFill 
                        onClick={() => setShowAddProduct(false)}
                        className={style.addProductFormIcon}
                    />
            </div>
            <form
                className={style.addProductForm}
                onSubmit={handleSubmit}
            >
            <div className={style.addProductFormImage}>
            <img src={logoSmall} alt="logo" />
            </div>
            <div className={style.addProductFormInputs}>
                <input
                    className={style.addProductInput}
                    required
                    type='text'
                    name='name'
                    placeholder='Product Name'
                    value={formData.name}
                    onChange={handleChange}
                />
                <input
                    className={style.addProductInput}
                    required
                    type='text'
                    name='productId'
                    placeholder='Product Id'
                    value={formData.productId}
                    onChange={handleChange}
                />
                <input
                    className={style.addProductInput}
                    required
                    type='text'
                    name='price'
                    placeholder={'Product Price'}
                    value={formData.price}
                    onChange={handleChange}
                />
                <input
                    className={style.addProductInput}
                    required
                    type='text'
                    name='quantity'
                    placeholder={'Product Quantity'}
                    value={formData.quantity}
                    onChange={handleChange}
                />
                {showFrequency && <input
                    className={style.addProductInput}
                    required
                    type='text'
                    name='frequency'
                    placeholder={'Product Frequency (Weeks)'}
                    value={formData.frequency}
                    onChange={handleChange}
                />}
                <div onClick={toggleFrequency} className={style.frequecyToggleContainer}>
                    {showFrequency 
                        ? <BsToggleOn className={style.frequencyToggleOn}/> 
                        : <BsToggleOff className={style.frequencyToggleOff}/>
                    }
                    <span>Toggle off if product will not be reordered</span>
                </div>
                <input
                    className={style.addProductSubmit}
                    disabled={
                        !formData.name ||
                        !formData.productId ||
                        !formData.price ||
                        !formData.quantity 
                    }
                    type='submit'
                    value='Add Product'
                />
            </div>
            </form>
        </section>
    </>
  )
};

export default AddProduct;