import { Button } from "components/Button";
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
  const [filterType, setFilterType] = useState<string>("like");
  const [thresholdNumber, setThresholdNumber] = useState<number>(2);
  useEffect(() => {
    if (session.status === "authenticated") {
      setUserId((session.data as any).userId!);
    }
  }, [session]);
  const [loadedTweets, setLoadedTweets] = useState<OembedTweetV1Result[]>();
  const tweetFetch = async (method: string = "GET") => {
    const res = await fetch(
      `api/user/tweets?filter=${filterType}:${thresholdNumber}&total=${totalTweets}&type=EMBED`,
      {
        method,
      }
    );
    const data = await res.json();
    if (method === "GET") {
      setLoadedTweets(data.tweets);
    }
    return data;
  };

  const deleteTweets = async () => {
    // delele all the tweets from the filter
    tweetFetch("DELETE");
  };

  useEffect(() => {
    const loadScript = function (src: string) {
      var tag = document.createElement("script");
      tag.src = src;
      var body = document.getElementsByTagName("body")[0];
      body.appendChild(tag);
    };

    loadScript("https://platform.twitter.com/widgets.js");
  }, [loadedTweets]);
  return (
    <Layout>
      <div className="max-w-2xl mx-auto my-20 ">
        <div className="p-1 rounded-md ">
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
            <div className="flex flex-row space-x-2">
              <Button
                styleType="primary"
                disabled={!userId}
                onClick={() => tweetFetch()}
              >
                let&apos;s see the damage
              </Button>
              <Button
                styleType="secondary"
                onClick={() => setDeleteModal(true)}
              >
                don&apos;t look back
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full mt-4 space-y-4">
          {loadedTweets &&
            loadedTweets.map((t, i) => (
              <div
                className="self-center w-full m-auto"
                dangerouslySetInnerHTML={{ __html: t.html }}
                key={i}
              />
            ))}
        </div>
      </div>
    </Layout>
  );
};
export default BathPage;
