import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { TECHMART_BASE_URL, DEFAULT_HEADERS } from '../api/client';

// --- TYPE DEFINITIONS ---

interface Product {
  id: number;
  name: string;
  img: string;
  price: string;
  oldPrice?: string | null;
  discount?: number | null;
}

interface ProductSection {
  title: string;
  subCategories: string[];
  products: Product[];
}

interface PopularCategory {
  name: string;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

interface PopularCategoryCardProps {
  category: PopularCategory;
}

interface IconProps {
  className?: string;
}

interface ProductCarouselProps {
  section: ProductSection;
}


// --- MOCK DATA ---

let popularCategories: PopularCategory[] = [
  { name: 'Photocopy Papers', image: 'https://i.imgur.com/s6yL2sB.png' },
  { name: 'CR Books', image: 'https://i.imgur.com/rE3v2xS.png' },
  { name: 'B5 Books', image: 'https://i.imgur.com/s6yL2sB.png' },
  // { name: 'Exercise Books', image: 'https://i.imgur.com/rE3v2xS.png' },
  // { name: 'School Stationery', image: 'https://i.imgur.com/s6yL2sB.png' },
  // { name: 'Kids Practical', image: 'https://i.imgur.com/rE3v2xS.png' },
  // { name: 'Office Stationery', image: 'https://i.imgur.com/s6yL2sB.png' },
  // { name: 'Notebooks & Notepads', image: 'https://i.imgur.com/rE3v2xS.png' },
  // { name: 'Publications', image: 'https://i.imgur.com/s6yL2sB.png' },
  // { name: 'Writing Tools', image: 'https://i.imgur.com/rE3v2xS.png' },
  // { name: 'Adhesives', image: 'https://i.imgur.com/s6yL2sB.png' },
];


// --- SVG ICONS ---
const ChevronLeftIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6 text-gray-600"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
);
const ChevronRightIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6 text-gray-600"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
);
const ShoppingCartIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);


// --- ASSETS & CONFIG ---
const kokopayLogoUrl = "https://www.promateworld.com/images/koko.png";

// --- SUB-COMPONENTS ---

const PopularCategoryCard: React.FC<PopularCategoryCardProps> = ({ category }) => (
  <div className="flex-shrink-0 w-28 text-center group">
<div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-200 group-hover:shadow-md transition-shadow">
  <img 
    src={category.image} 
    alt={category.name} 
    className="w-full h-full object-cover" 
  />
</div>

    <p className="mt-2 text-sm font-medium text-gray-700 group-hover:text-blue-600">{category.name}</p>
  </div>
);

const ProductCard: React.FC<ProductCardProps> = ({ product }) => (

  <a href={`/singleproduct?id=${product.id}`}>
    <div className="flex-shrink-0 w-56 text-left group p-2 rounded-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
      <div className="relative overflow-hidden rounded-lg border">
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        {product.discount !== 0 && (
          <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discount}%
          </div>
        )}
        <a href="#" onClick={(e) => e.preventDefault()} className="absolute inset-0">
          <button onClick={() => addToCart(String(product.id), 1)} className="absolute bottom-2 right-2 bg-lime-500 text-white p-2 rounded-full hover:bg-lime-600 transition-colors">
            <ShoppingCartIcon className="w-5 h-5" />
          </button>
        </a>
      </div>
      <h4 className="font-medium text-gray-800 mt-3 text-base h-12 overflow-hidden">{product.name}</h4>
      <div className="flex items-baseline space-x-2 mt-2">
        <p className="text-red-600 text-lg font-bold">LKR {product.price}</p>
        {product.oldPrice && (
          <p className="text-gray-500 line-through text-sm">LKR {product.oldPrice}</p>
        )}
      </div>
      <div className="text-xs text-gray-500 mt-1 h-8">
        {!isNaN(parseFloat(product.price)) &&
          <>
            <span>LKR {(parseFloat(product.price.replace(/,/g, '')) / 3).toFixed(2)} X 3 with </span>
            <img src={kokopayLogoUrl} alt="mintpay" className="h-3 inline-block" />
          </>
        }
      </div>
    </div>
  </a>
);

//addtoCart function

const addToCart = async (productId: string, qty: number) => {

  try {
    const response = await fetch(`${TECHMART_BASE_URL}/AddToCart?id=${productId}&qty=${qty}`, {
      method: "GET",
      credentials: "include",
      headers: {
        ...DEFAULT_HEADERS,
      }
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

//checkSessionCart function

const checkSessionCart = async () => {

  try {
    const response = await fetch(`${TECHMART_BASE_URL}/CheckSessionCart`, {
      method: "GET",
      credentials: "include",
      headers: {
        ...DEFAULT_HEADERS,
      }
    });

    if (response.ok) {
      const json = await response.json();
      if (json.status) {
        console.log(json.message);
      } else {
        console.log(json.message);
        toast.error(json.message);
      }
    } else {
      console.log("checkSessionCart failed. Please try again");
      toast.error("checkSessionCart failed. Please try again");
    }
  } catch (error) {
    toast.error("Internal Server Error. Please try again later");
    console.error("checkSessionCart Error:", error);
  }
};

//checkSessionCart function

// --- NEW PRODUCT CAROUSEL COMPONENT ---
const ProductCarousel: React.FC<ProductCarouselProps> = ({ section }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftStart(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = 'grabbing';
    scrollContainerRef.current.style.scrollBehavior = 'auto'; // Disable smooth scroll for drag
  };

  const handleMouseLeaveOrUp = () => {
    if (!scrollContainerRef.current) return;
    setIsDragging(false);
    scrollContainerRef.current.style.cursor = 'grab';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Multiplier for faster scrolling
    scrollContainerRef.current.scrollLeft = scrollLeftStart - walk;
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.scrollBehavior = 'smooth';
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
      });
    }
  };

  return (
    <section className="mb-10 mt-2">
      <div className="flex justify-between items-center mb-4 px-2 sm:px-0">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">{section.title}</h2>
        <div className="hidden sm:flex items-center space-x-4 text-sm font-medium text-gray-500">
          {section.subCategories.map(sub => (
            <a key={sub} href="#" className="hover:text-blue-600">{sub}</a>
          ))}
          <a href="/product/search" className="font-bold text-blue-600 hover:underline">View All</a>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute top-1/2 -translate-y-1/2 -left-4 z-20 bg-white p-1 rounded-full shadow-md hover:bg-gray-100 hidden md:flex items-center justify-center w-8 h-8">
          <ChevronLeftIcon />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute top-1/2 -translate-y-1/2 -right-4 z-20 bg-white p-1 rounded-full shadow-md hover:bg-gray-100 hidden md:flex items-center justify-center w-8 h-8">
          <ChevronRightIcon />
        </button>

        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
          className="flex items-stretch gap-6 p-2 -m-2 overflow-x-auto cursor-grab ps-3"
          style={{ userSelect: 'none', scrollbarWidth: 'none' }} /* Hide scrollbar */
        >
          {section.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      {/* Divider is now handled in the main component loop */}
    </section>
  );
};


// --- MAIN COMPONENT ---
const HomeProducts: React.FC = () => {
  const [productSections, setProductSections] = useState<ProductSection[]>([]);
  const [populerCategories, setPopulerCategories] = useState<PopularCategory[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const response = await fetch(`${TECHMART_BASE_URL}/LoadHomeProducts`, {
          method: "GET",
          credentials: "include",
          headers: {
            ...DEFAULT_HEADERS,
          }
        });

        if (response.ok) {
          const json = await response.json();
          if (isMounted) {
            if (json.status) {
              console.log(json);

              const sections = json.product.map((item: any) => ({
                title: item.mainCategory?.name || '',
                subCategories: Array.isArray(item.categorys)
                  ? item.categorys.map((c: any) => c?.name || '')
                  : [],
                products: Array.isArray(item.stocks)
                  ? item.stocks
                    .filter((p: any) => p?.product && typeof p.price === 'number')
                    .map((p: any) => ({
                      id: p.product.id,
                      name: p.product.title,
                      img: `http://localhost:8080/techmart/product-images/${p.product.id}/image1.png`,
                      price: p.price.toFixed(2),
                      oldPrice:
                        p.product.discount && p.product.discount !== 0
                          ? ((p.price * 100) / (100 - p.product.discount)).toFixed(2)
                          : null,
                      discount: p.product.discount || 0,
                    }))
                  : [],
              }));

              setProductSections(sections);

            } else {
              console.log(json.message);
              toast.error(json.message);
            }
          }
        } else {
          console.log("LoadHomeProducts failed. Please try again");
          toast.error("LoadHomeProducts failed. Please try again");
        }
      } catch (error) {
        toast.error("Internal Server Error. Please try again later");
        console.error("LoadHomeProducts Error:", error);
      }
    };

    const loadPopulerCategories = async () => {
      try {
        const response = await fetch(`${TECHMART_BASE_URL}/LoadPopulerCategories`, {
          method: "GET",
          credentials: "include",
          headers: {
            ...DEFAULT_HEADERS,
          }
        });

        if (response.ok) {
          const json = await response.json();
          if (json.status) {
            console.log(json);

            const items = json.categories.map((item: any) => ({
              name: item.name,
              image: item.image
            }));

            setPopulerCategories(items);

          } else {
            console.log(json.message);
            toast.error(json.message);
          }
        } else {
          console.log("LoadPopulerCategories failed. Please try again");
          toast.error("LoadPopulerCategories failed. Please try again");
        }
      } catch (error) {
        toast.error("Internal Server Error. Please try again later");
        console.error("LoadPopulerCategories Error:", error);
      }
    };

    loadPopulerCategories();
    loadProducts();
    checkSessionCart();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-white p-2 sm:p-6 md:p-8 font-sans">

      {/* Popular Categories Section */}
      <section className="">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 px-2 sm:px-0">Popular Categories</h2>
        <div className="flex items-start gap-4 p-2 -m-2 overflow-x-auto">
          {populerCategories.map((category) => (
            <PopularCategoryCard key={category.name} category={category} />
          ))}
        </div>
        <hr className=" border-gray-200 mt-5" />
      </section>

      {/* Product Sections */}
      {productSections.map((section, index) => (
        <React.Fragment key={section.title}>
          <ProductCarousel section={section} />
          {index < productSections.length - 1 && <hr className="mt-10 border-gray-200" />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default HomeProducts;
