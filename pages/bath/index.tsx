import Layout from "components/Layout";
import Tweet from "components/Tweet";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { TweetV2 } from "twitter-api-v2";
const BathPage = () => {
  const session = useSession();
  const [userId, setUserId] = useState<string>();
  useEffect(() => {
    if (session.status === "authenticated") {
      console.log(session);
      setUserId((session.data as any).userId!);
    }
  }, [session]);
  const [loadedTweets, setLoadedTweets] = useState<TweetV2[]>();
  const onFormSubmit = async (values: any) => {
    const res = await fetch(
      `api/user/${userId}/timeline?filter=${values.filter}:${values.threshold}&total=${values.total}`
    );
    const data = await res.json();
    setLoadedTweets(data.tweets);
  };

  const deleteTweets = () => {
    // delelet all the tweets from a filter
  };
  return (
    <Layout>
      <div className="max-w-2xl mx-auto my-20 ">
        <Formik
          initialValues={{ total: "EVERY", filter: "like", threshold: 0 }}
          onSubmit={(values) => onFormSubmit(values)}
        >
          <div className="p-1 rounded-md bg-gradient-to-bl from-green-300 via-blue-500 to-purple-600">
            <Form className="flex flex-col items-start px-12 py-8 space-y-4 bg-white rounded form-container">
              <div className="flex space-x-4 text-lg font-semibold">
                <div>Delete</div>
                <Field
                  name="total"
                  className="flex items-center w-24 px-3 border border-gray-200 rounded appearance-none"
                />
                <div>tweet w/</div>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  name="filter"
                  className="px-3 py-1.5 transition ease-in-out border-gray-200 border bg-white rounded"
                >
                  <option value="like">Likes</option>
                  <option value="retweet">Retweets</option>
                  <option value="date">Date</option>
                </select>
                <div>less than</div>
                <Field
                  className="px-3 border border-gray-200 rounded appearance-none "
                  name="threshold"
                  type="number"
                />
              </div>
              {/* TODO: Abstract this into a fun button with different text for submission */}
              <div className="flex flex-row">
                <button
                  className=" text-gray-50 py-1.5 px-3 mr-4 rounded bg-gradient-to-bl from-green-300 via-blue-500 to-purple-600"
                  type="submit"
                >
                  let's see the damage
                </button>
                <button
                  onClick={() => void 0}
                  className=" cursor-pointer rounded text-red-600 py-1.5 px-3 border-red-600 border"
                >
                  don't look back
                </button>
              </div>
            </Form>
          </div>
        </Formik>
        <div className="mt-4 space-y-4">
          {loadedTweets && loadedTweets.map((t, i) => <Tweet {...t} key={i} />)}
        </div>
      </div>
    </Layout>
  );
};
export default BathPage;
