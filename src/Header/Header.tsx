import { ShoppingCart } from 'lucide-react';
import { useCart } from '../Cart/useCart';
import { useEffect, useState } from 'react';

export default function Header() {

  const { cartCount, fetchCartCount } = useCart();
  const [searchText, setSearchText] = useState('');
  const [promo, setPromo] = useState('The Future of Tech, Today. Gear up with the latest innovations.');

  const handleSearch = () => {

    window.location.href = `/product/search?find=${encodeURIComponent(searchText)}`;
    setSearchText(""); // Clear the input after navigating
  };

  useEffect(() => {
    const eventSource = new EventSource(
      "http://localhost:8080/techmart/AlertReceiver"
    );

    eventSource.onopen = () => {
      console.log("SSE Connected");
    };

    eventSource.onmessage = (event) => {
      console.log("Received:", event.data);

      setPromo(event.data);

      sessionStorage.setItem(
        "alerts",
        JSON.stringify(event.data)
      );

    };

    eventSource.onerror = (err) => {
      console.error("SSE Error:", err);
    };

    console.log("Alerts from sessionStorage:", sessionStorage.getItem("alerts"));

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <>
      <div className='fixed w-full top-0 z-50 flex flex-col items-center bg-slate-50 p-4' onClick={fetchCartCount}>

        <div className="w-10/12 top-0 z-50 flex justify-between bg-slate-50">
          {/* <!-- brand-image --> */}
          <div className="w-4/12 mx-auto items-center">
            <a href="/">
              <img className="h-12"
                src="https://raw.githubusercontent.com/DinukaDilshan415/images/d51a7cf6eebab5ce7a5581130005650c9a42dcd1/tmsvg.svg"
                alt="" />
            </a>
          </div>

          {/* <!-- search bar --> */}
          <div className="w-8/12 flex items-center justify-center" >
            <div className="w-full max-w-2xl">
              <div className="relative flex items-center">
                <div className="absolute flex items-center">

                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 top-2.5 ml-3 text-slate-600"
                    viewBox="0,0,256,256">
                    <g fill="#696969" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt"
                      stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0"
                      font-family="none" font-weight="none" font-size="none" text-anchor="none"
                      style={{ mixBlendMode: "normal" }}>
                      <g transform="scale(5.12,5.12)">
                        <path
                          d="M21,3c-9.39844,0 -17,7.60156 -17,17c0,9.39844 7.60156,17 17,17c3.35547,0 6.46094,-0.98437 9.09375,-2.65625l12.28125,12.28125l4.25,-4.25l-12.125,-12.09375c2.17969,-2.85937 3.5,-6.40234 3.5,-10.28125c0,-9.39844 -7.60156,-17 -17,-17zM21,7c7.19922,0 13,5.80078 13,13c0,7.19922 -5.80078,13 -13,13c-7.19922,0 -13,-5.80078 -13,-13c0,-7.19922 5.80078,-13 13,-13z">
                        </path>
                      </g>
                    </g>
                  </svg>

                  <div className="h-6 border-l border-slate-200 ml-2.5"></div>
                </div>

                <input
                  className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-3 pl-14 py-2 transition duration-300 ease focus:outline-none focus:border-edumartSecondary hover:border-edumartHover shadow-sm focus:shadow"
                  placeholder="Find Here..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />


                <button onClick={handleSearch}
                  className="rounded-md ml-2 bg-edumartPrimary cursor-pointer p-2 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow-lg hover:bg-edumartHover active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fill-rule="evenodd"
                      d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                      clip-rule="evenodd" />
                  </svg>
                </button>

              </div>
            </div>
          </div>

          {/* <!-- cart/login --> */}
          <div className="w-4/12 flex items-center justify-center text-right">

            {/* <!-- cart --> */}
            <div className="w-6/12">
              <a href="/product/cart">
                <button type="button"
                  className="relative inline-flex items-center cursor-pointer text-sm font-medium text-center text-white mt-1 p-1 hover:shadow-lg hover:border-2 hover:border-sky-300 rounded-xl">
                  <ShoppingCart color="#000000" size={26} />

                  <span className="sr-only">Notifications</span>
                  <div
                    className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-black border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">
                    {cartCount}</div>
                </button>
              </a>
            </div>

            {/* <!-- profile/login --> */}
            <div className="w-6/12 flex items-center justify-center">
              <a href="/home/myaccount"><button type="button"
                className="relative inline-flex items-center text-sm font-medium text-center text-white cursor-pointer">

                <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 mr-1">
                  <title></title>
                  <g id="User">
                    <path
                      d="M41.2452,33.0349a16,16,0,1,0-18.49,0A26.0412,26.0412,0,0,0,4,58a2,2,0,0,0,2,2H58a2,2,0,0,0,2-2A26.0412,26.0412,0,0,0,41.2452,33.0349ZM20,20A12,12,0,1,1,32,32,12.0137,12.0137,0,0,1,20,20ZM8.09,56A22.0293,22.0293,0,0,1,30,36h4A22.0293,22.0293,0,0,1,55.91,56Z">
                    </path>
                  </g>
                </svg>
              </button></a>

              <button type="button"
                className="text-black hover:text-edumartHover font-bold text-xl cursor-pointer">
                <a href="/login">Login</a>
              </button>

            </div>
          </div>
        </div>

        <div className="w-10/12 mt-2 text-center">
          <span className="text-m text-slate-600 font-semibold">{promo}</span>
        </div>
      </div>
    </>

  );
}