import { format } from 'date-fns';
import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';

// --- Type Definitions for TypeScript ---

interface IconProps {
  className?: string;
  size?: number;
}

// Updated Product interface for related products
interface Product {
  id: number;
  name: string;
  price: string;
  oldPrice: string;
  img: string;
  // rating: number;
  // reviewCount: number;
}

interface ProductData {
  mainCategory: string;
  category: string;
  subCategory: string;
  brand: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  imagePath: string;
  id: string;
}

interface ReviewData {
  rating: number;
  reviewCount: number;
  reviewText: string;
  date: string;
  customer: string;
}


type Tab = 'description' | 'reviews';

interface ProductTabsProps {
  activeTab: Tab;
  setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
  product: ProductData;
  reviews: ReviewData[];
}

interface ProductCardProps {
  product: Product;
}


// --- SVG Icon Components (Typed for TypeScript) ---

const StarIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22px" height="22px">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const FacebookIcon: React.FC<IconProps> = ({ className, size = 20 }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M14 13.5h2.5l.5-2.5h-3v-1.5c0-.7.2-1.2 1.2-1.2h1.3V6.2c-.2 0-.9-.1-1.8-.1-1.8 0-3 1.1-3 3.1v1.8h-2v2.5h2V22h3v-8.5z" />
  </svg>
);

const TwitterIcon: React.FC<IconProps> = ({ className, size = 20 }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.72-1.89-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.76 2.8 1.91 3.56-.71 0-1.37-.22-1.95-.54v.05c0 2.08 1.48 3.82 3.44 4.21-.36.1-.74.15-1.13.15-.28 0-.55-.03-.81-.08.55 1.7 2.14 2.94 4.03 2.97-1.47 1.15-3.33 1.83-5.35 1.83-.35 0-.69-.02-1.03-.06 1.9 1.22 4.16 1.93 6.56 1.93 7.88 0 12.2-6.54 12.2-12.2 0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.22z" />
  </svg>
);

const LinkedInIcon: React.FC<IconProps> = ({ className, size = 20 }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-12 6v9h3V11H7zM8.5 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM18 18v-5a2.5 2.5 0 0 0-5 0v5h-3V11h3v1.1c.5-.9 1.6-1.6 3-1.6 2.2 0 4 1.8 4 4v4.5h-2z" />
  </svg>
);

const TruckIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M20.5 14.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S19 16.83 19 16s.67-1.5 1.5-1.5M6.5 14.5c.83 0 1.5.67 1.5 1.5S7.33 17.5 6.5 17.5 5 16.83 5 16s.67-1.5 1.5-1.5M21 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 14.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zm14.5.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM15 13H3V6h12v7z" />
  </svg>
);

const LockIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z" />
  </svg>
);

const GiftIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M20 6h-2.18c.11-.31.18-.65.18-1a3 3 0 0 0-3-3c-1.66 0-3 1.34-3 3 0 .35.07.69.18 1H9.82c.11-.31.18-.65.18-1a3 3 0 0 0-3-3c-1.66 0-3 1.34-3 3 0 .35.07.69.18 1H2v14h10v-7h-2l4-4 4 4h-2v7h6V6z" />
  </svg>
);

const MoneyBillWaveIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M1 4v16h22V4H1zm20 14H3V6h18v12zM9 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
  </svg>
);

const ShoppingCartIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const ChevronLeftIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRightIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);


// --- Placeholder Data & URLs ---
const promoImageUrl = "https://github.com/DinukaDilshan415/images/blob/main/ChatGPTImageJun21202611_34_13P.jpeg?raw=true";
const kokopayLogoUrl = "https://www.promateworld.com/images/koko.png";

// --- Sub-components ---

const ProductTabs: React.FC<ProductTabsProps> = ({ activeTab, setActiveTab, product, reviews }) => (
  <div className="w-full mt-12">
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        <button
          onClick={() => setActiveTab('description')}
          className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg cursor-pointer ${activeTab === 'description' ? 'border-yellow-400 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer'}`}
        >
          Description
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg cursor-pointer ${activeTab === 'reviews' ? 'border-yellow-400 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer'}`}
        >
          Reviews ({reviews[0]?.reviewCount ?? 0})
        </button>
      </nav>
    </div>
    <div className="py-6 text-gray-600">
      {activeTab === 'description' && (
        <p>
          {product.description}
        </p>
      )}
      {activeTab === 'reviews' && (
        reviews.map((item: ReviewData, index) => (
          <>
          <div key={index} className='mt-2'>
            <span className='mb-2'> {item.date}</span>
            <p><span className="font-semibold">{item.customer}</span></p>
            <div className="flex items-start space-x-4">
              <div className="flex items-center text-yellow-400 mt-1">
                {[...Array(item.rating)].map((_, i) => (
                  <StarIcon key={i} className="text-yellow-400" />
                ))}
              </div>
              <p className="font-semibold text-lg"> | {item.reviewText}</p>
            </div>            
          </div>
          <hr className='mt-2'/>
          </>
        ))
      )}

    </div>
  </div>
);

const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
  <a href={`/singleproduct?id=${product.id}`}>
    <div className="flex-shrink-0 w-52 text-left group p-2 rounded-lg transition-all duration-200 ease-in-out hover:shadow-xl hover:-translate-y-2">
      <div className="relative overflow-hidden rounded-lg border">
        <div className="aspect-w-1 aspect-h-1 w-full bg-gray-100">
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">-20%</div>
        <a href="#" onClick={(e) => e.preventDefault()} className="absolute inset-0">
          <button onClick={() => addToCart(String(product.id), 1)} className="absolute bottom-2 right-2 bg-lime-500 text-white p-2 rounded-full hover:bg-lime-600 transition-colors">
            <ShoppingCartIcon className="w-5 h-5" />
          </button>
        </a>
      </div>
      <h4 className="font-medium text-gray-800 mt-3 text-base h-10">{product.name}</h4>
      <div className="flex items-baseline space-x-2 mt-2">
        <p className="text-red-600 text-lg font-bold">LKR {product.price}</p>
        <p className="text-gray-500 line-through text-sm">LKR {product.oldPrice}</p>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        <span>LKR {(parseFloat(product.price.replace(/,/g, '')) / 3).toFixed(2)} X 3 with </span>
        <img src={kokopayLogoUrl} alt="mintpay" className="h-3 inline-block" />
      </div>
      {/* <div className="flex items-center mt-1">
            <div className="flex text-yellow-400">
                {[...Array(product.rating)].map((_, i) => <StarIcon key={i} className="w-4 h-4" />)}
                {[...Array(5 - product.rating)].map((_, i) => <StarIcon key={i} className="w-4 h-4 text-gray-300" />)}
            </div>
            <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
        </div> */}
    </div>
  </a>
);

const RelatedProducts: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    scrollRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    if (!scrollRef.current) return;
    setIsDragging(false);
    scrollRef.current.style.cursor = 'grab';
  };

  const handleMouseUp = () => {
    if (!scrollRef.current) return;
    setIsDragging(false);
    scrollRef.current.style.cursor = 'grab';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiplier for faster scrolling
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };


  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full mt-12">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Related products</h3>
      <div className="relative">
        <button onClick={() => scroll('left')} className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all hidden md:block">
          <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
        </button>
        <div
          ref={scrollRef}
          className="flex space-x-10 overflow-x-auto pb-4 scrollbar-hide cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {relatedProductsData.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <button onClick={() => scroll('right')} className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all hidden md:block">
          <ChevronRightIcon className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

//addtoCart function

const addToCart = async (productId: string, qty: number) => {

  try {
    const response = await fetch(`http://localhost:8080/techmart/AddToCart?id=${productId}&qty=${qty}`, {
      method: "GET",
      credentials: "include"
    });

    if (response.ok) {
      const json = await response.json();
      if (json.status) {
        console.log(json.message);
        toast.success(json.message);
      } else {
        console.log(json.message);
        toast.error(json.message);
      }
    } else {
      console.log("AddToCart failed. Please try again");
      toast.error("AddToCart failed. Please try again");
    }
  } catch (error) {
    toast.error("Internal Server Error. Please try again later");
    console.error("AddToCart Error:", error);
  }
};

//addtoCart function

/**
 * A responsive single product view component with functional quantity and tabs.
 */

let relatedProductsData: Product[] = [
  { id: 1, name: "ProMate A7 Flip-up Spiral Pad 100Pgs", price: "112.00", oldPrice: "140.00", img: "https://placehold.co/220x220/f0f0f0/333?text=Pad+1" },
  // { id: 2, name: "ProMate A5 Thinkbook Royaux 200Pgs", price: "1,720.00", oldPrice: "2,150.00", img: "https://placehold.co/220x220/f0f0f0/333?text=Book+2", rating: 5, reviewCount: 2 },
  // { id: 3, name: "ProMate A6 Flip-up Spiral Pad 50Pgs", price: "144.00", oldPrice: "180.00", img: "https://placehold.co/220x220/f0f0f0/333?text=Pad+2", rating: 5, reviewCount: 1 },
  // { id: 4, name: "ProMate A4 Hardcover Flip-on Spiral Pad 100Pgs", price: "880.00", oldPrice: "1,100.00", img: "https://placehold.co/220x220/f0f0f0/333?text=Pad+3", rating: 5, reviewCount: 2 },
  // { id: 5, name: "ProMate B5 Flip-on Spiral Pad 100Pgs", price: "560.00", oldPrice: "700.00", img: "https://placehold.co/220x220/f0f0f0/333?text=Pad+4", rating: 5, reviewCount: 1 },
  // { id: 6, name: "ProMate 180mmx90mm Notebook 100Pgs", price: "116.00", oldPrice: "145.00", img: "https://placehold.co/220x220/f0f0f0/333?text=Notebook", rating: 5, reviewCount: 1 },
  // { id: 7, name: "ProMate 120mmx76mm Pocket Notebook 100Pgs", price: "76.00", oldPrice: "95.00", img: "https://placehold.co/220x220/f0f0f0/333?text=Pocket+Book", rating: 5, reviewCount: 1 },
];

const ProductPage: React.FC = () => {
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<Tab>('description');

  const [product, setProduct] = useState<ProductData>({
    mainCategory: '',
    category: '',
    subCategory: '',
    brand: '',
    title: '',
    description: '',
    price: 0,
    discount: 0,
    imagePath: 'https://placehold.co/400x400/e0e0e0/757575?text=Loading...',
    id: ''
  });

  const [review, setReview] = useState<ReviewData[]>([]);

  useEffect(() => {
    const loadProductData = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get('id');
      if (!id) {
        toast.error("Product ID is missing from the URL.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/techmart/LoadSingleProduct?id=${id}`, {
          method: "GET",
          credentials: "include"
        });

        if (response.ok) {
          const json = await response.json();
          if (json.status) {
            setProduct({
              mainCategory: json.product.subCategory.category.mainCategory.name,
              category: json.product.subCategory.category.name,
              subCategory: json.product.subCategory.name,
              brand: json.product.brand.name,
              title: json.product.title,
              description: json.product.description,
              price: json.stock.price,
              discount: json.product.discount,
              imagePath: `http://localhost:8080/techmart/product-images/${json.product.id}/image1.png`,
              id: json.product.id
            });

            relatedProductsData = json.stockList.map((item: any) => ({
              id: item.product.id,
              name: item.product.title,
              price: item.price.toFixed(2),
              oldPrice: (item.price * 100 / (100 - item.product.discount)).toFixed(2),
              img: `http://localhost:8080/techmart/product-images/${item.product.id}/image1.png`
            }));
          } else {
            console.log(json.message);
            toast.error(json.message);
          }
        } else {
          console.log("LoadSingleProduct failed. Please try again");
          toast.error("LoadSingleProduct failed. Please try again");
        }
      } catch (error) {
        toast.error("Internal Server Error. Please try again later");
        console.error("LoadSingleProduct Error:", error);
      }
    };

    const loadProductReviews = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get('id');
      if (!id) {
        toast.error("Product ID is missing from the URL.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/techmart/LoadProductReviews?id=${id}`, {
          method: "GET",
          credentials: "include"
        });

        if (response.ok) {
          const json = await response.json();
          if (json.status) {

            const items = json.reviewsList.map((item: any) => ({
              rating: item.rating,
              reviewCount: json.reviewsCount,
              reviewText: item.review_text,
              date: format(new Date(item.created_at), 'yyyy-MM-dd'),
              customer: item.user.username
            }));

            setReview(items);

          } else {
            console.log(json.message);
            toast.error(json.message);
          }
        } else {
          console.log("LoadProductReviews failed. Please try again");
          toast.error("LoadProductReviews failed. Please try again");
        }
      } catch (error) {
        toast.error("Internal Server Error. Please try again later");
        console.error("LoadProductReviews Error:", error);
      }
    };

    loadProductData();
    loadProductReviews();
  }, []);

  const handleIncrease = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleDecrease = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const formattedPrice1 = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(product.price);

  const displayPrice = () => {
    const priceNum = parseFloat(String(product.price));
    const discountNum = parseFloat(String(product.discount));

    if (isNaN(priceNum) || isNaN(discountNum) || discountNum >= 100) return '';

    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(((priceNum * 100 / (100 - discountNum))).toFixed(2)));
  };

  //buy now process

  const buyNowProcess = async (id: string, qty: number) => {

    try {
      const response = await fetch(`http://localhost:8080/techmart/BuyNowProcess?id=${id}&qty=${qty}`, {
        method: "GET",
        credentials: "include"
      });

      if (response.ok) {
        const json = await response.json();
        if (json.status) {
          window.location.href = "/product/cart/checkout";

        } else {
          console.log(json.message);
          toast.error(json.message);
        }
      } else {
        console.log("BuyNowProcess failed. Please try again");
        toast.error("BuyNowProcess failed. Please try again");
      }
    } catch (error) {
      toast.error("Internal Server Error. Please try again later");
      console.error("BuyNowProcess Error:", error);
    }
  };

  //buy now process

  return (
    <div className="font-sans bg-white text-gray-800 pt-20">
      <div className="container mx-auto p-4 lg:p-8">
        {/* BREADCRUMBS NAVIGATION */}
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <a href="#" className="hover:text-green-600 transition-colors">Home</a> /
          <a href="#" className="hover:text-green-600 transition-colors"> Products</a> /
          <a href="#" className="hover:text-green-600 transition-colors"> {product.mainCategory}</a> /
          <a href="#" className="hover:text-green-600 transition-colors"> {product.category}</a> /
          <span className="text-gray-700"> {product.subCategory}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-8 gap-y-8">

          {/* --- LEFT COLUMN: PRODUCT IMAGES & SOCIAL SHARE --- */}
          <div className="lg:col-span-5">
            <div className="flex flex-col-reverse md:flex-row gap-4">
              <div className="flex-shrink-0 md:w-24 flex md:flex-col items-center justify-start gap-3">
                <div className="w-20 h-20 border-2 border-green-500 rounded-md p-1 cursor-pointer">
                  <img
                    src={product.imagePath}
                    alt="Thumbnail"
                    className="w-full h-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).onerror = null; (e.target as HTMLImageElement).src = 'https://placehold.co/80x80/e0e0e0/757575?text=Img'; }}
                  />
                </div>
              </div>
              <div className="flex-1 border rounded-lg p-4 flex items-center justify-center h-[350px] md:h-[450px]">
                <img
                  src={product.imagePath}
                  alt="Main product"
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).onerror = null; (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/e0e0e0/757575?text=Image+Not+Found'; }}
                />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center md:justify-start space-x-4">
              <span className="text-sm font-medium text-gray-600">Share:</span>
              <a href="#" aria-label="Share on Facebook" className="text-gray-400 hover:text-blue-600 transition-colors"><FacebookIcon /></a>
              <a href="#" aria-label="Share on Twitter" className="text-gray-400 hover:text-sky-500 transition-colors"><TwitterIcon /></a>
              <a href="#" aria-label="Share on LinkedIn" className="text-gray-400 hover:text-blue-700 transition-colors"><LinkedInIcon /></a>
            </div>
          </div>

          {/* --- MIDDLE COLUMN: PRODUCT DETAILS --- */}
          <div className="lg:col-span-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {product.title}
            </h1>
            <div className="flex flex-wrap items-center text-sm text-gray-600 mb-4 gap-x-4 gap-y-2">
              <span>Brand: <a href="#" className="text-green-600 font-semibold hover:underline">{product.brand}</a></span>
              <div className="flex items-center">
                <div className="flex items-center text-yellow-400">
                  {[...Array(review[0]?.rating ?? 0)].map((_, i) => <StarIcon key={i} className="text-yellow-400" />)}
                </div>
                <a href="#" className="ml-2 hover:underline">({review[0]?.reviewCount ?? 0} reviews)</a>
              </div>
            </div>
            <hr className="my-4" />
            <div>
              <span className="text-gray-500 line-through text-lg">LKR {displayPrice()}</span>
              <div className="flex items-baseline space-x-3 mt-1">
                <span className="text-4xl font-bold text-red-600">LKR {formattedPrice1}</span>
                <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2.5 py-1 rounded-full">-{product.discount}% OFF</span>
              </div>
            </div>
            <div className="flex items-center bg-gray-50 p-3 rounded-lg my-5 border">
              <span className="font-semibold">LKR {(product.price / 3).toFixed(2)} X 3</span>
              <span className="text-gray-500 mx-2">with</span>
              <img src={kokopayLogoUrl} alt="mintpay" className="h-4" />
            </div>
            <div className="flex items-center my-6">
              <label htmlFor="quantity" className="font-semibold mr-4 text-gray-800">Quantity</label>
              <div className="flex border rounded-md overflow-hidden">
                <button onClick={handleDecrease} className="px-4 py-2 font-bold text-lg hover:bg-gray-100 transition-colors">-</button>
                <input type="text" id="quantity" value={quantity} readOnly className="w-14 text-center border-x focus:outline-none" />
                <button onClick={handleIncrease} className="px-4 py-2 font-bold text-lg hover:bg-gray-100 transition-colors">+</button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => addToCart(String(product.id), quantity)} className="flex-1 bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-900 transition-transform transform hover:scale-105 cursor-pointer">Add to cart</button>
              <button onClick={() => buyNowProcess(String(product.id), quantity)} className="flex-1 bg-lime-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-lime-600 transition-transform transform hover:scale-105 cursor-pointer">Buy Now</button>
            </div>
            <hr className="my-6" />
            <div className="text-sm text-gray-600 space-y-2">
              <div>
                <strong>Categories:</strong>
                <a href="#" className="text-green-600 hover:underline ml-1">{product.mainCategory}</a> /
                <a href="#" className="text-green-600 hover:underline ml-1">{product.category}</a> /
                <a href="#" className="text-green-600 hover:underline ml-1">{product.subCategory}</a>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: SERVICES & PROMO --- */}
          <div className="lg:col-span-3">
            <div className="border rounded-lg p-4 space-y-4 text-sm text-gray-700 bg-gray-50">
              <div className="flex items-center"><TruckIcon className="text-gray-500 mr-4 flex-shrink-0" /> Island wide Delivery</div>
              <div className="flex items-center"><LockIcon className="text-gray-500 mr-4 flex-shrink-0" /> Secure Payments</div>
              <div className="flex items-center"><GiftIcon className="text-gray-500 mr-4 flex-shrink-0" /> Gift Service Available</div>
              <div className="flex items-center"><MoneyBillWaveIcon className="text-gray-500 mr-4 flex-shrink-0" /> Pay online or when receiving goods</div>
            </div>
            <div className="mt-8">
              <img
                src={promoImageUrl}
                alt="Stationery Promotion"
                className="w-full rounded-lg shadow-md"
                onError={(e) => { (e.target as HTMLImageElement).onerror = null; (e.target as HTMLImageElement).src = 'https://placehold.co/300x400/e0e0e0/757575?text=Promo'; }}
              />
            </div>
          </div>
        </div>

        {/* --- TABS & RELATED PRODUCTS SECTION --- */}
        <div className="mt-8">
          <ProductTabs activeTab={activeTab} setActiveTab={setActiveTab} product={product} reviews={review} />
          <RelatedProducts />
        </div>

      </div>
    </div>
  );
};

export default ProductPage;
