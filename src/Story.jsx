import React, { useEffect, useState, useRef } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import { BsPen, BsArrowLeft } from "react-icons/bs";
import Popular from "./Popular";
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { FaRegStar, FaStar, FaShareAlt } from "react-icons/fa";

import SwiperCore, { EffectCoverflow } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "swiper/components/effect-coverflow/effect-coverflow.min.css";
SwiperCore.use([EffectCoverflow]);

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import Modal from "./Modal";

const appSetting = {
  databaseURL: "https://sysu-2d774-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSetting);
const database = getDatabase(app);
// const List = ref(database, 'List')

const cat = ref(database, "Category");
const storiesList = ref(database, "List");

let initialCategories = [
  "FIGMA",
  "FOOD",
  "ENGINEERING",
  "CINEMA",
  "JOURNALISM",
];

export default function Story() {
  const [swiper, setSwiper] = useState(null);

  const [subject, setSubject] = useState("");
  const [describe, setDescribe] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [search, setSearch] = useState("");
  const [searchResults2, setSearchResults2] = useState([]);

  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState([]);
  const [randomCat, setRandom] = useState([]);
  const [mappable, setMappable] = useState([]);

  const [show, setShow] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const [menu, setMenu] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [content, setContent] = useState(false);

  const [check, setCheck] = useState("");
  const [selectedValue, setSelectedValue] = useState("");

  const [stories, setStories] = useState(0);
  const [expandedSections, setExpandedSections] = useState({});
  const [reveal, setReveal] = useState({});
  const [list, setList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [starredCategories, setStarredCategories] = useState(
    JSON.parse(localStorage.getItem("starredCategories")) || []
  );

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // For closing the dropdown of What are you looking for? outside of somewhere else
  const dropdownRef = useRef(null);
  const { category } = useParams();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Check if the clicked element is outside the dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Close the dropdown
        setShow3(false);
        // setShow4(false);
      }
    };

    // Add click event listener to the document
    document.addEventListener("click", handleOutsideClick);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    setSearch(category);
  }, [category]);

  useEffect(() => {
    onValue(cat, function (snapshot) {
      if (snapshot.exists()) {
        const entries = Object.entries(snapshot.val());
        setCategories(entries.map((item) => item[1]));
        setNewCat(entries.map((item) => item[1]));
        setRandom(entries.map((item) => item[1]));
      }
    });
  }, []);

  useEffect(() => {
    if (randomCat.length > 0) {
      const random = Math.floor(Math.random() * categories.length);
      setCheck(randomCat[random]);
    }
  }, [randomCat]);

  useEffect(() => {
    onValue(storiesList, (snapshot) => {
      const data = snapshot.val();
      setList(Object.entries(data));
    });
  }, []);

  const sortedCatList = list
    ?.map((cat) => Object.entries(cat[1]))
    .sort((a, b) => {
      const lengthComparison = b.length - a.length;

      if (lengthComparison !== 0) {
        return lengthComparison;
      }

      const timestampA = new Date(a[0][1].timeStamp).getTime();
      const timestampB = new Date(b[0][1].timeStamp).getTime();

      return timestampB - timestampA;
    })
    .map((data) => data[0][1].category);

  const filterCatList = [...new Set(sortedCatList.concat(initialCategories))];

  function getCurrentDateTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = String(now.getFullYear());
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${day}-${month}-${year}-${hours}-${minutes}-${seconds}`;
  }

  function handleValue(e) {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "subject") {
      setSubject(value);
    } else if (name === "description") {
      setDescribe(value);
    }
  }

  function handleSearch(e) {
    const searchValue = e.target.value;
    setSearchText(searchValue);

    const results = performSearch(searchValue);
    setSearchResults(results);
  }

  function handleSearch2(e) {
    setSearch(e.target.value);
    setMenu(false);
    setShow3(true);

    const results = performSearch2(e.target.value);
    setSearchResults2(results);
  }

  function handleCategorySelect(category) {
    setSelectedCategory(category.toUpperCase());
    setSearchText("");
    setSearchResults([]);
    setShow(false);
  }

  function handleCategorySelect2(category) {
    setSelectedValue("");
    setSearch(category);
    setSearchResults2([]);
    searchBar(category);
  }

  function performSearch(searchValue) {
    const filteredCategories =
      categories &&
      categories.filter((category) =>
        category.toLowerCase().startsWith(searchValue.toLowerCase())
      );

    return filteredCategories;
  }

  function performSearch2(searchValue) {
    const filteredCategories =
      randomCat &&
      randomCat.filter((category) =>
        category.toLowerCase().startsWith(searchValue.toLowerCase())
      );

    return filteredCategories;
  }

  function clear() {
    setSubject("");
    setDescribe("");
    setSearchText("");
    setSelectedCategory("");
  }

  function handleSubmit(e) {
    const random = Math.random() * 4;
    e.preventDefault();
    const Data = {
      subject: subject,
      description: describe,
      category: selectedCategory,
      timeStamp: getCurrentDateTime(),
      id: random,
    };

    if (subject && describe && selectedCategory) {
      push(ref(database, `List/${selectedCategory}`), Data);

      if (selectedCategory) {
        if (
          newCat &&
          !newCat.some(
            (item) => item.toLowerCase() === selectedCategory.toLowerCase()
          )
        ) {
          push(cat, selectedCategory);
          toast.success("Story has posted successfully");
        }
        toast.success("Story has posted successfully");
        clear();
      }
    }

    // setContent(false)
  }

  function handleShow() {
    setShow((prev) => !prev);
  }

  function handleAdd() {
    setSelectedCategory(searchText.toUpperCase());
    setSearchText("");
    setSearchResults([]);
    setShow(false);

    if (searchText) {
      if (
        initialCategories &&
        !initialCategories.some(
          (item) => item.toLowerCase() === searchText.toLowerCase()
        )
      ) {
        setCategories((prevCategories) => [...prevCategories, searchText]);
        initialCategories.push(searchText);
      }
    }
  }

  function searchBar(cat) {
    cat && setMenu(true);
    setShow3(false);
    setShow4(false);
  }

  function handleClick() {
    setShow3((prev) => !prev);
    setShow4(false);
  }

  function handleClick2() {
    setShow4((prev) => !prev);
    setShow3(false);
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    windowWidth > 425 ? setContent(true) : setContent(false);
  }, [windowWidth]);

  function handleflip() {
    setFlipped((prev) => !prev);
  }

  function handleChildValue(value) {
    setSelectedValue(value);
    setSearch("");
  }

  function formattedDate(dateTimeString) {
    const dateTimeParts = dateTimeString.split("-");

    const day = dateTimeParts[0];
    const month = dateTimeParts[1];
    const year = dateTimeParts[2];

    return `${day}-${month}-${year}`;
  }

  function formattedDate2(dateTimeString) {
    const dateTimeParts = dateTimeString.split("-");

    const day = dateTimeParts[0];
    const month = dateTimeParts[1];
    const year = dateTimeParts[2];

    return `${month}-${day}-${year}`;
  }

  function formattedTime(dateTimeString) {
    const dateTimeParts = dateTimeString.split("-");

    const hours = dateTimeParts[3];
    const minutes = dateTimeParts[4];
    const seconds = dateTimeParts[5];

    return `${hours}-${minutes}-${seconds}`;
  }

  useEffect(() => {
    if (windowWidth > 425) {
      setReveal({});
    } else if (windowWidth <= 425) {
      setShow4(false);
      setShow(false);
    }
  }, [windowWidth]);

  function togglePara(itemId) {
    windowWidth > 425
      ? setExpandedSections((prevExpandedSections) => ({
          ...prevExpandedSections,
          [itemId]: !prevExpandedSections[itemId],
        }))
      : setReveal((prevReveal) => ({
          ...prevReveal,
          [itemId]: !prevReveal[itemId],
        }));
  }

  const revealMain = {
    position: "absolute",
    top: "0px",
    left: windowWidth > 375 ? "-75px" : windowWidth > 320 ? "-90px" : "-80px",
    width: windowWidth > 320 ? "283px" : "250px",
    height: "257px",
    boxShadow: "1px 1px 0px #000000",
  };

  const revealhead = {
    alignSelf: "center",
    width: "194px",
    marginBottom: "8px",
  };

  const revealPara = {
    marginTop: "initial",
    width: "215px",
    overflowY: reveal ? "auto" : "hidden",
    maxHeight: "112px",
    fontSize: "0.625rem",
  };

  function goback() {
    setReveal({});
  }

  useEffect(() => {
    if (selectedValue) {
      onValue(
        ref(database, `List/${selectedValue.toUpperCase()}`),
        function (snapshot) {
          if (snapshot.exists()) {
            setStories(Object.entries(snapshot.val()).length);
            setMappable(Object.entries(snapshot.val()));
          }
        }
      );
    }
    setReveal({});
  }, [selectedValue]);

  useEffect(() => {
    if (check) {
      onValue(
        ref(database, `List/${check.toUpperCase()}`),
        function (snapshot) {
          if (snapshot.exists()) {
            setStories(Object.entries(snapshot.val()).length);
            setMappable(Object.entries(snapshot.val()));
          }
        }
      );
    }

    setReveal({});
  }, [check]);

  useEffect(() => {
    if (search) {
      const categoryRef = ref(database, `List/${search.toUpperCase()}`);
      onValue(categoryRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setStories(Object.entries(snapshot.val()).length);
          setMappable(Object.entries(snapshot.val()));
        } else {
          setStories(0);
          setMappable([]);
        }
      });
    }
    setReveal({});
  }, [search]);

  function showContent() {
    setContent((prev) => !prev);
  }

  function paragraph(item) {
    if (item) {
      const words = item[1].split(" ");
      const isExpanded = expandedSections[item[2]];
      const isRevealed = reveal[item[2]];

      if (words.length > 24 && !isExpanded) {
        return (
          <div
            className="item-section"
            key={item[2]}
            style={isRevealed ? revealMain : {}}
          >
            <div className="item-category">
              <h3>{item[0]}</h3>
              <p>{formattedDate(item[4])}</p>
            </div>
            {isRevealed && (
              <BsArrowLeft className="left-arrow" onClick={goback} />
            )}
            <h2 style={isRevealed ? revealhead : {}}>{item[3]}</h2>
            <div className="show-para">
              {isRevealed ? (
                <p style={isRevealed ? revealPara : {}}>
                  {item[1].slice(0, item[1].length)}...
                </p>
              ) : (
                <p>{item[1].slice(0, 154)}...</p>
              )}
            </div>
            {windowWidth > 425 ? (
              <span className="read-more" onClick={() => togglePara([item[2]])}>
                Read more...
              </span>
            ) : (
              !isRevealed && (
                <span
                  className="read-more"
                  onClick={() => togglePara([item[2]])}
                >
                  Read more...
                </span>
              )
            )}
          </div>
        );
      } else {
        return (
          <div
            className="item-section"
            key={item[2]}
            style={isRevealed ? revealMain : {}}
          >
            <div className="item-category">
              <h3>{item[0]}</h3>
              <p>{formattedDate(item[4])}</p>
            </div>
            {isRevealed && (
              <BsArrowLeft className="left-arrow" onClick={goback} />
            )}
            <h2 style={isRevealed ? revealhead : {}}>{item[3]}</h2>
            <div className="show-para">
              <p style={isRevealed ? revealPara : {}}>{item[1]}</p>
            </div>
            {words.length > 24 && windowWidth > 425 ? (
              <span className="read-more" onClick={() => togglePara(item[2])}>
                Read less
              </span>
            ) : (
              words.length > 24 &&
              !isRevealed && (
                <span className="read-more" onClick={() => togglePara(item[2])}>
                  Read more...
                </span>
              )
            )}
          </div>
        );
      }
    }
  }

  function sorted(mappable) {
    const sortedMappable = mappable.sort((a, b) => {
      const dateA = new Date(formattedDate2(Object.values(a[1])[4]));
      const dateB = new Date(formattedDate2(Object.values(b[1])[4]));

      if (dateA < dateB) {
        return flipped ? 1 : -1;
      }

      if (dateA > dateB) {
        return flipped ? -1 : 1;
      }

      const timeA = formattedTime(Object.values(a[1])[4]);
      const timeB = formattedTime(Object.values(b[1])[4]);

      if (timeA < timeB) {
        return flipped ? 1 : -1;
      }
      if (timeA > timeB) {
        return flipped ? -1 : 1;
      }
    });

    return sortedMappable.map((items, index) => {
      const random = Math.random() * 4;
      return (
        <div key={random} className="single-items">
          {paragraph(Object.values(items[1]))}
        </div>
      );
    });
  }

  // Added Favourite feature
  const toggleStar = (category) => {
    const updatedStarredCategories = [...starredCategories];

    if (updatedStarredCategories.includes(category)) {
      updatedStarredCategories.splice(
        updatedStarredCategories.indexOf(category),
        1
      );
    } else {
      updatedStarredCategories.push(category);
    }

    setStarredCategories(updatedStarredCategories);
    localStorage.setItem(
      "starredCategories",
      JSON.stringify(updatedStarredCategories)
    );
  };

  return (
    <div className="flex">
      <Popular onChildValue={handleChildValue} />
      <div className="story-section">
        <form className="section-1">
          <div className="section-1-head">
            <h1>Write your own story</h1>
            <BsPen className="pen" onClick={showContent} />
          </div>
          {content && (
            <div className="section-1-content">
              <div className="subject">
                <label htmlFor="subject">
                  <h3>Topic</h3>
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="write the topic for your story "
                  value={subject}
                  onChange={(e) => handleValue(e)}
                  required
                />
              </div>

              <div className="description">
                <label htmlFor="describe">
                  <h3>Description</h3>
                </label>
                <textarea
                  value={describe}
                  name="description"
                  id="describe"
                  placeholder="write what your story is about here"
                  onChange={(e) => handleValue(e)}
                  required
                />
              </div>

              <div className="selectCategory">
                <div className="select-btn" onClick={handleShow}>
                  {selectedCategory ? (
                    <span>{selectedCategory.toUpperCase()}</span>
                  ) : (
                    <span>Select a category</span>
                  )}
                  <BiChevronDown className="down" />
                </div>

                {show && (
                  <div className="content">
                    <div className="search">
                      <AiOutlineSearch className="search-btn" />
                      <input
                        type="text"
                        id="category"
                        placeholder="Search"
                        value={searchText}
                        onChange={handleSearch}
                        required
                      />
                    </div>

                    {searchText.length === 0 ? (
                      <ul className="search-list">
                        {filterCatList?.map((category) => (
                          <li
                            key={category}
                            onClick={() => handleCategorySelect(category)}
                          >
                            {category}
                          </li>
                        ))}
                      </ul>
                    ) : searchResults.length > 0 ? (
                      <ul className="search-list">
                        {searchResults.map((category) => (
                          <li
                            key={category}
                            onClick={() => handleCategorySelect(category)}
                          >
                            {category}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="search-list">
                        <li onClick={handleAdd}>Add new category</li>
                      </ul>
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="submit-btn"
                onClick={handleSubmit}
              >
                PUBLISH YOUR STORY
              </button>
            </div>
          )}
        </form>

        <div className="middle-line" />

        <section className="section-2">
          <div className="section-2-head">
            <h1>Read stories on {search || check || selectedCategory}</h1>

            <div className="looking">
              <div className="choose">
                <label htmlFor="choose">
                  <h3>What are you looking for?</h3>
                </label>
                <div className="choose" ref={dropdownRef} onClick={handleClick}>
                  <input
                    type="text"
                    id="choose"
                    placeholder="Browse a Category"
                    value={search}
                    onChange={handleSearch2}
                    required
                  />
                  <BiChevronDown className="btn-2" />
                </div>
              </div>

              {show4 ? (
                <ul className="search-list search-list-2">
                  {filterCatList.map((category) => (
                    <li
                      key={category}
                      onClick={() => handleCategorySelect2(category)}
                    >
                      <Link
                        className="category-link"
                        to={`/${category?.toLowerCase()}`}
                      >
                        {category}
                      </Link>
                      {/* {category} */}
                    </li>
                  ))}
                </ul>
              ) : show3 && search.length === 0 ? (
                <ul className="search-list search-list-2">
                  {filterCatList.map((category) => (
                    <li
                      key={category}
                      onClick={() => handleCategorySelect2(category)}
                    >
                      <Link
                        className="category-link"
                        to={`/${category.toLowerCase()}`}
                      >
                        {category}
                      </Link>
                      {/* {category} */}
                    </li>
                  ))}
                </ul>
              ) : (
                show3 &&
                searchResults2.length > 0 && (
                  <ul className="search-list search-list-2">
                    {searchResults2.map((category) => (
                      <li
                        key={category}
                        onClick={() => handleCategorySelect2(category)}
                      >
                        {category}
                      </li>
                    ))}
                  </ul>
                )
              )}
            </div>
          </div>

          <div className="filter">
            <h1 className="total-story">
              <span>
                {stories === 1
                  ? `${stories} story`
                  : stories === 0
                  ? `0 story`
                  : `${stories} stories`}
              </span>{" "}
              for you to read
            </h1>
            <div className="favourite">
              <div
                onClick={() => toggleStar(search || check || selectedCategory)}
              >
                {starredCategories.includes(
                  search || check || selectedCategory
                ) ? (
                  <FaStar size={30} className="golden" />
                ) : (
                  <FaRegStar size={30} />
                )}
              </div>
              <div>
                <FaShareAlt size={25} onClick={() => setOpenModal(true)} />
              </div>
              <div className="flex-filter">
                <h2 className="filter-heading">
                  Sort:
                  <span onClick={handleflip}>
                    {flipped ? `Newest to Oldest` : `Oldest to Newest`}
                  </span>
                </h2>
                <CgArrowsExchangeAltV
                  className="filterarrow"
                  onClick={handleflip}
                />
              </div>
            </div>
          </div>

          {windowWidth > 425 ? (
            <div>
              {selectedValue && (
                <div className="container">
                  <section className="item-section-main">
                    <div className="item-section-container">
                      {check && mappable && sorted(mappable)}
                    </div>
                  </section>
                </div>
              )}

              {/* If stories are not there */}
              {mappable?.length === 0 && (
                <div className="container">
                  <section className="item-section-main">
                    <div className="item-section-container">
                      <p>No Stories found for this Category</p>
                    </div>
                  </section>
                </div>
              )}

              {(!menu || search.length === 0) && (
                <div className="container">
                  <section className="item-section-main">
                    <div className="item-section-container">
                      {check && mappable && sorted(mappable)}
                    </div>
                  </section>
                </div>
              )}

              {search?.length > 0 && menu && (
                <div className="container">
                  <section className="item-section-main">
                    <div className="item-section-container">
                      {sorted(mappable)}
                    </div>
                  </section>
                </div>
              )}
            </div>
          ) : (
            <div className="container">
              <section className="item-section-main">
                <Swiper
                  effect="coverflow"
                  // grabCursor='true'
                  centeredSlides="true"
                  slidesPerView={3}
                  coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 200,
                    modifier: 1,
                    slideShadows: false,
                  }}
                  // onSwiper={handleSwiperInit}
                  // onSlideChange={handleSlideChange}
                >
                  <div className="swiper-wrapper">
                    {(() => {
                      const sortedMappable = mappable.sort((a, b) => {
                        const dateA = new Date(
                          formattedDate2(Object.values(a[1])[4])
                        );
                        const dateB = new Date(
                          formattedDate2(Object.values(b[1])[4])
                        );

                        if (dateA < dateB) {
                          return flipped ? 1 : -1;
                        }

                        if (dateA > dateB) {
                          return flipped ? -1 : 1;
                        }

                        const timeA = formattedTime(Object.values(a[1])[4]);
                        const timeB = formattedTime(Object.values(b[1])[4]);

                        if (timeA < timeB) {
                          return flipped ? 1 : -1;
                        }
                        if (timeA > timeB) {
                          return flipped ? -1 : 1;
                        }
                      });

                      return sortedMappable.map((items, index) => {
                        const random = Math.random() * 4;
                        return (
                          <SwiperSlide key={random} className="swiper-slide">
                            {paragraph(Object.values(items[1]))}
                          </SwiperSlide>
                        );
                      });
                    })()}
                  </div>
                </Swiper>
              </section>
            </div>
          )}
        </section>
      </div>
      {/* Modal for copying link */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        category={category}
      />
    </div>
  );
}
