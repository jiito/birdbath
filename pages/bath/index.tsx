import Layout from "components/Layout";
import Tweet from "components/Tweet";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { OembedTweetV1Result, TweetV2 } from "twitter-api-v2";
const BathPage = () => {
  const session = useSession();
  const [userId, setUserId] = useState<string>();
  const [totalTweets, setTotalTweets] = useState<number>(11);
  const [filterType, setFilterType] = useState<string>("likes");
  const [thresholdNumber, setThresholdNumber] = useState<number>(2);
  useEffect(() => {
    if (session.status === "authenticated") {
      console.log(session);
      setUserId((session.data as any).userId!);
    }
  }, [session]);
  const [loadedTweets, setLoadedTweets] = useState<OembedTweetV1Result[]>();
  const onFormSubmit = async (values: any) => {
    const res = await fetch(
      `api/user/${userId}/timeline?filter=${values.filter}:${values.threshold}&total=${values.total}&type=EMBED`
    );
    const data = await res.json();
    console.log(data);
    setLoadedTweets(data.tweets);
  };

  const deleteTweets = () => {
    // delele all the tweets from a filter
    console.log(filterType, thresholdNumber);
  };
  return (
    <Layout>
      <div className="max-w-2xl mx-auto my-20 ">
        <div className="p-1 rounded-md bg-gradient-to-bl from-green-300 via-blue-500 to-purple-600">
          <div className="flex flex-col items-start px-12 py-8 space-y-4 bg-white rounded form-container">
            <div className="flex space-x-4 text-lg font-semibold">
              <div>delete</div>
              <input
                name="total"
                value={totalTweets}
                onChange={(e) => setTotalTweets(parseInt(e.target.value))}
                className="flex items-center w-24 px-3 border border-gray-200 rounded appearance-none"
              />
              <div>tweets w/</div>
            </div>
            <div className="flex items-center space-x-2">
              <select
                name="filter"
                className="px-3 py-1.5 transition ease-in-out border-gray-200 border bg-white rounded"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="like">likes</option>
                <option value="retweet">retweets</option>
                <option value="date">date</option>
              </select>
              <div>less than</div>
              <input
                className="px-3 border border-gray-200 rounded appearance-none "
                name="threshold"
                type="number"
                value={thresholdNumber}
                onChange={(event) =>
                  setThresholdNumber(parseInt(event.target.value))
                }
              />
            </div>
            {/* TODO: Abstract this into a fun button with different text for submission */}
            <div className="flex flex-row">
              <button
                className=" text-gray-50 py-1.5 px-3 mr-4 rounded bg-gradient-to-bl from-green-300 via-blue-500 to-purple-600"
                disabled={!userId}
              >
                let's see the damage
              </button>
              <button
                onClick={() => deleteTweets()}
                className=" cursor-pointer rounded text-red-600 py-1.5 px-3 border-red-600 border"
              >
                don't look back
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mt-4 space-y-4">
          {loadedTweets &&
            loadedTweets.map((t, i) => (
              <div dangerouslySetInnerHTML={{ __html: t.html }} key={i} />
            ))}
        </div>
      </div>
    </Layout>
  );
};
export default BathPage;
