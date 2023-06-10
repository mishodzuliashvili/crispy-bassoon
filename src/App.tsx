import { useEffect } from "react";
import { Links } from "./components/Links";
import { Navbar } from "./components/Navbar";
import {
  PeriodOptions,
  SortOptions,
  getCatsOptions,
  getMansOptions,
  getModelsOfMans,
  getProducts,
} from "./models/Documents";
import {
  AugmentedMansModelsType,
  AugmentedProductType,
  CatsType,
  MansType,
  PeriodType,
  PriceFromType,
  PriceToType,
  RentType,
  SearchResponseType,
  SortType,
} from "./models/Types";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { useState } from "react";
import { ForRentDropdown } from "./components/ForRentDropdown";
import { CarIcon, MotoIcon, TractorIcon } from "./assets/Icons";
import { CatsDropdown } from "./components/CatsDropdown";
import { Cars } from "./components/Cars";
import { MansDropdwown } from "./components/MansDropdown";
import { ModelsDropdown } from "./components/ModelsDropdown";
import { PriceChose } from "./components/PriceChose";
import { Dropdown } from "./components/Dropdown";
function App() {
  const [mansOptions, setMansOptions] = useState<MansType[]>([]);
  const [modelsOptions, setModelsOptions] = useState<AugmentedMansModelsType[]>(
    []
  );
  const [catsOptions, setCatsOptions] = useState<CatsType[]>([]);
  const [cars, setCars] = useState<SearchResponseType>();
  // pages and total pages
  // do last thing
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number | undefined>(undefined);
  const [total, setTotal] = useState<number | undefined>(undefined);
  // chosen ones
  const [chosenMans, setChosenMans] = useState<MansType[]>([]);
  const [chosenModels, setChosenModels] = useState<AugmentedMansModelsType[]>(
    []
  );
  const [chosenCats, setChosenCats] = useState<CatsType[]>([]);

  const [rent, setRent] = useState<RentType | undefined>(undefined);
  const [sort, setSort] = useState<SortType["name"] | undefined>(undefined);
  const [period, setPeriod] = useState<PeriodType["name"] | undefined>(
    undefined
  );
  const [priceFrom, setPriceFrom] = useState<PriceFromType | undefined>(
    undefined
  );
  const [priceTo, setPriceTo] = useState<PriceToType | undefined>(undefined);
  const [generalPrice, setGeneralPrice] = useState<string>("lari");
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    getProducts({}).then((res) => {
      setPage(res.current_page);
      setTotalPages(res.last_page);
      setCars(res);
      setTotal(res.total);
    });
    getMansOptions().then((res) => {
      setMansOptions(res);
    });
    getCatsOptions().then((res) => {
      setCatsOptions(res);
    });
  }, []);
  useEffect(() => {
    if (period) {
      getCars();
    }
  }, [period]);
  useEffect(() => {
    if (sort) {
      getCars();
    }
  }, [sort]);
  useEffect(() => {
    if (chosenMans.length > 0) {
      getModelsOfMans(...chosenMans.map((man) => parseInt(man.man_id))).then(
        (res) => {
          setModelsOptions(res);
        }
      );
    } else {
      if (chosenModels.length > 0) {
        setChosenModels([]);
      }
      if (modelsOptions.length > 0) {
        setModelsOptions([]);
      }
    }
    // TODO: fix this
    // ? setModelsOptions([]);
  }, [chosenMans]);
  const getCars = () => {
    setLoading(true);
    getProducts({
      ForRent: rent?.value,
      MansWithModels: chosenModels,
      Cats: chosenCats.map((c) => c.category_id),
      PriceFrom: priceFrom,
      PriceTo: priceTo,
      Period: PeriodOptions.find((p) => p.name === period)?.value,
      SortOrder: SortOptions.find((s) => s.name === sort)?.value,
      Page: page,
    })
      .then((res) => {
        setCars(res);
        setPage(res.current_page);
        setTotalPages(res.last_page);
      })
      .then(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    page > 1 && getCars();
  }, [page]);
  return (
    <>
      <Navbar />
      <div className="max-w-screen-mainxl mx-auto px-4 mainxl:px-0">
        <Links />
        <div className="mt-5 grid gap-5 grid-cols-[250px_1fr] items-start justify-start">
          {/* sidebar */}
          <div className="w-64 bg-white sidebar border border-gray-300 ">
            <div className="grid grid-cols-3">
              <button className="flex items-center justify-center py-4 border-r border-r-gray-300 rounded-tl-xl bg-white border-b border-b-orange-600">
                <CarIcon />
              </button>
              <button className="flex items-center justify-center py-4 border-r border-r-gray-300 bg-gray-100 border-b border-b-gray-300">
                <TractorIcon />
              </button>
              <button className="flex items-center justify-center py-4 bg-gray-100 rounded-tr-xl border-b border-b-gray-300">
                <MotoIcon />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-5">
              <ForRentDropdown rent={rent} setRent={setRent} />
              <MansDropdwown
                mansOptions={mansOptions}
                chosenMans={chosenMans}
                setChosenMans={setChosenMans}
                setChosenModels={setChosenModels}
              />
              <ModelsDropdown
                mansOptions={mansOptions}
                setChosenMans={setChosenMans}
                modelsOptions={modelsOptions}
                chosenModels={chosenModels}
                setChosenModels={setChosenModels}
              />
              <CatsDropdown
                options={catsOptions}
                chosen={chosenCats}
                setChosen={setChosenCats}
              />
              <PriceChose
                priceFrom={priceFrom}
                setPriceFrom={setPriceFrom}
                priceTo={priceTo}
                setPriceTo={setPriceTo}
                generalPrice={generalPrice}
                setGeneralPrice={setGeneralPrice}
              />
            </div>
            <div className="search-bar p-5">
              <button
                onClick={getCars}
                className="bg-orange-600 p-3 text-white w-full hover:bg-orange-700 duration-300"
              >
                ძიება {total && total.toLocaleString()}
              </button>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-3 mt-3 items-center">
              <span>{cars?.total} განცხადება</span>
              <div className="flex gap-3">
                <Dropdown
                  options={PeriodOptions}
                  chosen={period}
                  setChosen={setPeriod}
                />
                <Dropdown
                  options={SortOptions}
                  chosen={sort}
                  setChosen={setSort}
                />
              </div>
            </div>
            <Cars generalPrice={generalPrice} cars={cars} loading={loading} />
            <div>
              {/* pagination */}
              <div className="flex justify-center items-center gap-3 mt-5 mb-10">
                <button
                  onClick={() => {
                    setPage(page - 1);
                  }}
                  disabled={page === 1}
                  className={`${
                    page === 1
                      ? "bg-gray-200 text-gray-400"
                      : "bg-white text-gray-600"
                  } w-10 h-10 flex items-center justify-center rounded-full`}
                >
                  <FaLongArrowAltLeft />
                </button>
                <div className="flex gap-3">
                  <button disabled={true}>{page}</button>
                </div>
                <button
                  onClick={() => {
                    setPage(page + 1);
                  }}
                  disabled={page === cars?.last_page}
                  className={`${
                    page === cars?.last_page
                      ? "bg-gray-200 text-gray-400"
                      : "bg-white text-gray-600"
                  } w-10 h-10 flex items-center justify-center rounded-full`}
                >
                  <FaLongArrowAltRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
