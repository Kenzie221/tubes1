import React from "react";
import { Sidebar } from "../UI/Sidebar";
import classes from "./BookDetails.module.css"
import { SearchBox } from '../UI/SearchBox'
import { SearchResult } from '../components/SearchResult'
import { useState } from "react";
import { defer, json, redirect, useLoaderData, useNavigate, useRouteLoaderData } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginModal from "../components/auth/Login";
import { BookingModals } from "../components/BookingModal";
import { CartProvider, useCart } from "react-use-cart";
import Modal from "../UI/Modal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getUserCredentials } from "../components/util/auth";

const BookDetail = () => {
    console.log("nasiodhalsdhoas")
    const notify = () => toast.success('Booking Success', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });


    const gagal = () => toast.warning('Book is already on the booking list!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });
    const stokHabis = () => toast.warning('Book is out of stock', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });
    const cartPenuh = () => toast.warning('Your cart is full! Maximum booking is 3', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });
    const bookingAda = () => toast.error('You have ordered this book, grab it at the library', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });
    const pinjamAda = () => toast.error('You have borrowed this book, finish it first!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });
    const pinjamCount = () => toast.error('Books borrowed is over the limit!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });
    const pesanCount = () => toast.error('Books booked is over the limit (3), please grab the book at the library!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });
    const batasCount = () => toast.error('Books borrowed is over the limit! Please finsih it first.', {
        position: "top-center",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });
    const isAuth = useSelector((state) => state.auth.isAuth);
    const akun = useSelector((state) => state.auth.user);
    const [isAdded, setIsAdded] = useState(false);
/*     const { addItem, items, inCart, totalUniqueItems } = useCart(); */

   const{items,inCart,addItem,totalUniqueItems}= useCart();
   console.log(inCart);
    // console.log(akun)

    const navigate = useNavigate();

    const { book,stokBuku } = useLoaderData('book-detail');
    const { pemesanan } = useLoaderData('book-detail');
    const { peminjaman } = useLoaderData('book-detail');


    // const existingPeminjaman = peminjaman.find((item) => item.id_buku === book.id_buku && item.id_siswa === akun.user.id_siswa);
    // const existingPemesanan = pemesanan.find((item) => item.id_buku === book.id_buku && item.id_siswa === akun.user.id_siswa);
    const backHandler = () => {
        navigate("..");
    }

    let handleAddToCart=()=>{}

    if(isAuth)
    {
        const existingPemesanan = pemesanan.find(item => item?.id_buku === book?.id_buku && item?.id_siswa === akun?.user?.id_siswa);
        const existingPeminjaman = peminjaman.find(item => item?.id_buku === book?.id_buku && item?.id_siswa === akun?.user?.id_siswa);
        console.log(existingPemesanan)
        const countPemesanan = pemesanan.filter(item => item.id_siswa === akun.user?.id_siswa).length
    
        const countPeminjaman = peminjaman.filter(item => item.id_siswa === akun.user?.id_siswa).length
    
        console.log(pemesanan)
        console.log(`Existing : ${existingPeminjaman}`)
        console.log(peminjaman)
    
        const batasBook = countPemesanan + countPeminjaman;
        handleAddToCart = () => {
    
            const existingItem = inCart(book.id_buku)
            console.log(existingItem)
            if(stokBuku.stok <= 0)
            {
                stokHabis()
            }
            else if (existingPemesanan) {
                bookingAda()
            }
            else if (existingPeminjaman) {
                pinjamAda()
    
            } else if (countPemesanan === 3) {
                pesanCount()
            } else if (countPeminjaman === 3) {
                pinjamCount()
            }
            else if (batasBook === 3) {
                batasCount()
            }
            else if (existingItem) {
                gagal()
            } else if (totalUniqueItems === 3) {
                cartPenuh()
            } else {
                addItem({
                    id: book.id_buku,
                    name: book.judul_buku,
                    price: "--",
                    penerbit: book.penerbit,
                    pengarang: book.pengarang,
                    sinopsis: book.sinopsis,
                    id_akun: akun.user.id_siswa,
                    gambar: book.gambar_buku,
                    genre: book.kategori.nama_kategori
                });
                notify()
    
            }
    
        
    }
   
    };
   
    const [showBookingModal, setBookingModal] = useState(false)
    const [showLogin, setShowLogin] = useState(false);

    const showLoginModal = () => {
        setShowLogin(true);
    }
    const closeLoginModal = () => {
        setShowLogin(false);
    }

    return (
        <>
        <div className={classes.layout}>
        {isAuth && <Sidebar />}
            <div className={classes.content}>
                <div className={classes.cardtopmain}>
                    <div className={classes.cardtop}>
                        <div className={classes.covertop}>
                            <div className={classes['texttop']}>
                                {/* <h1>The Crown Library</h1> */}
                              
                            </div>
                        </div>
                        <div className={classes.card}>
                            <div className={classes.cover}>
                                <img src={`http://localhost:8080${book.gambar_buku}`} className={classes['imagefoto']}></img>
                            </div>

                            <div className={classes.book_info}>
                                <h2>{book.judul_buku}</h2>
                                <div className={classes.summary}>
                                    {/* <h3>Sinopsis</h3> */}
                                    <p>{book.sinopsis}</p>
                                </div>
                                <div className={classes.infotable}>
                                    <table>
                                        <tr>
                                            <td>Author</td>
                                            <td style={{ width: "5vw" }}>:</td>
                                            <td style={{  fontWeight: "500", width: "20vw" }}>{book.pengarang}</td>
                                        </tr>
                                        <tr>
                                            <td>Publisher</td>
                                            <td style={{ width: "5vw" }}>: &nbsp;</td>
                                            <td style={{  fontWeight: "500", width: "20vw" }}>{book.penerbit}</td>
                                        </tr>
                                        <tr>
                                            <td>Year</td>
                                            <td style={{ width: "5vw" }}>: &nbsp;</td>
                                            <td style={{  fontWeight: "500", width: "20vw" }}>{book.tahun_terbit}</td>
                                        </tr>
                                        <tr>
                                            <td>ISBN</td>
                                            <td style={{ width: "5vw" }}>: &nbsp;</td>
                                            <td style={{  fontWeight: "500", width: "20vw" }}>{book.isbn}</td>
                                        </tr>
                                        <tr>
                                            <td>Genre</td>
                                            <td style={{ width: "5vw" }}>: &nbsp;</td>
                                            <td style={{  fontWeight: "500", width: "20vw" }}>{book.kategori.nama_kategori}</td>
                                        </tr>
                                        <tr>
                                            <td>Stock</td>
                                            <td style={{ width: "5vw" }}>: &nbsp;</td>
                                            <td style={{  fontWeight: "500", width: "20vw" }}>{stokBuku.stok>0?stokBuku.stok:"Kosong"}</td>
                                        </tr>
                                    </table>
                                    <button className={classes["button-back"]} onClick={backHandler}>Back</button>
                                    {/* button ini belum jalan seperti semestinya */}
                                    {showLogin && <LoginModal onClose={closeLoginModal} />}
                                    {/* {showBookingModal && <BookingModals onClose={closeBookingModalHandler} id={book.id_buku} judulBuku={book.judul_buku}/>} */}
                                    <button className={classes["button-borrow"]} onClick={() => {
                                        if (!isAuth) {
                                            showLoginModal();
                                        } else {
                                            handleAddToCart();
                                        }
                                    }}
                                    >  {!isAdded ? "Pinjam Buku" : "✔ Telah Dibooking"}</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>

        </>
    )
}

export default BookDetail

const loadBook = async (id) => {
    const response = await fetch("http://localhost:8080/perpustakaan-crown/buku/" + id)
    console.log(response);
    if (!response.ok) {
        throw json(
            { message: 'Could not fetch events.' },
            {
                status: 500,
            }
        );
    }
    else {
        const resData = await response.json();
        return resData;
    }
}

const loadStock=async(id)=>{
    const response=await fetch("http://localhost:8080/perpustakaan-crown/buku-perpus/"+id);
    console.log(response);
    if(!response.ok)
    {
        throw json(
            { message: 'Could not fetch books.' },
            {
              status: 500,
            }
          );
    }
    const resData=await response.json();
    return resData.data;
}


const loadBorrowed = async (id) => {
    const data=getUserCredentials()
    const response = await fetch("http://localhost:8080/perpustakaan-crown/peminjaman-siswa-by-user",{
        method:"GET",
        headers:{
            "Authorization":"Bearer "+data.accessToken
        }
    })
    console.log(response);
    if (!response.ok) {
      throw json(
        { message: 'Could not fetch books.' },
        {
          status: 500,
        }
      );
    }
    else {
      const resData = await response.json();
     /*  console.log(resData.peminjaman) */
      return resData;
    }
  }



const loadPesan = async () => {
    const response = await fetch("http://localhost:8080/perpustakaan-crown/pemesanan-buku/")
    console.log(response);
    if (!response.ok) {
        throw json(
            { message: 'Could not fetch peminjaman.' },
            {
                status: 500,
            }
        );
    }
    else {
        const resData = await response.json();
        return resData;
    }
}

export  const loader=async({ request, params })=>{
    const idBuku = params.bookId;
    console.log(idBuku);
    let id = getUserCredentials();
    console.log(id);
    id=id?id.user.id_siswa:null;
    console.log(id);
    const dataPinjam=id!=null?await loadBorrowed(id):null;
    const peminjamanData =id!=null?dataPinjam:null;
    const stok =await loadStock(idBuku);
   
   

    return defer({
        book: await loadBook(idBuku),
       /*  daftarBookingDanPemesanan: data, */
       stokBuku:stok,
        peminjaman: peminjamanData,
        pemesanan:id?await loadPesan():null
    });
}