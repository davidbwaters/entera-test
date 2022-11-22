import { useState, useEffect } from "preact/hooks";
import "./input.css";

export function Input({handleClick}: any) {
  const [showList, setShowList] = useState(false);
  const [data, setData]:[any, any] = useState({});
  const [query, setQuery] = useState("");

  const handleChange = (value: string) => {

    if (value.length > 2) {
      fetch(
        "https://api.data.gov/ed/collegescorecard/v1/schools?per_page=20&school.name=" +
          encodeURIComponent(value) +
          "&fields=location,school.name&api_key=" +
          import.meta.env.VITE_COLLEGE_SCORECARD_API_KEY
      )
        .then((r) => r.json())
        .then((d) => {
          //setData(d);

          console.log(data)
          let pages = Math.ceil(d.metadata.total / d.metadata.per_page);

          (async function () {

            let index = 1;
            let newData = d;
            let array = new Array(pages-1).fill(0)
            for await (let i of array) {
              await fetch(
                "https://api.data.gov/ed/collegescorecard/v1/schools?per_page=20&page=" +
                  index +
                  "&school.name=" + encodeURIComponent(value) +
                  "&fields=location,school.name&api_key=" +
                  import.meta.env.VITE_COLLEGE_SCORECARD_API_KEY
              )
                .then((r) => {
                  return r.json();
                })
                .then((d) => {

                  console.log(newData)
                  newData.results = [...newData.results, ...d.results];
                });
              index++;

            }
            setData(newData);
          }());

        });
    }
    else {
      setData({});
    }
  }

  useEffect(() => handleChange(query), [query]);
  return (
    <div class="u-position-relative u-z-index-10">
      <input
        name="input"
        class="c-input"
        onChange={(e) => {
          setQuery((e.target as HTMLInputElement).value)}
        }
        onFocus={() => setShowList(true)}
        onBlur={() => setShowList(false)}
        value={query}
        placeholder="Search for schools ..."
      ></input>
      <div class="c-scroll-list" style={showList && data.results && data.results.length > 0 ? { opacity: "1" } : { opacity: "0" }}>
        {
          data.results && data.results.map((result:any) =>
            <button onClick={() => {
              handleClick(result["location.lon"],result["location.lat"])
            }} class="c-button c-button--block">
              {result["school.name"]}
            </button>
          )
        }
      </div>
    </div>
  );
}
