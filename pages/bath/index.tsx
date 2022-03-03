import Layout from "components/Layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
const BathPage = () => {
  const [loadedTweets, setLoadedTweets] = useState();
  const onFormSubmit = (values: any) => {
    fetch(
      `api/user/timeline?filter=${values.filter}:${values.threshold}&total=${values.total}`
    );
  };
  return (
    <Layout>
      <div className=" max-w-2xl mx-auto my-20">
        <Formik
          initialValues={{ total: "EVERY", filter: "like", threshold: 0 }}
          onSubmit={(values) => console.log(values)}
        >
          <div className="bg-gradient-to-bl from-green-300 via-blue-500 to-purple-600 p-1 rounded-md">
            <Form className="form-container flex flex-col bg-white items-start py-8 px-12 rounded space-y-4">
              <div className="flex text-lg font-semibold space-x-4">
                <div>Delete</div>
                <Field
                  name="total"
                  className="w-24 appearance-none border border-gray-200 px-3 rounded flex items-center"
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
                  className=" appearance-none border border-gray-200 px-3 rounded"
                  name="threshold"
                  type="number"
                />
              </div>
              <button
                className=" text-gray-50 py-1.5 px-3 rounded bg-gradient-to-bl from-green-300 via-blue-500 to-purple-600"
                type="submit"
              >
                let's see the damage
              </button>
            </Form>
          </div>
        </Formik>
      </div>
    </Layout>
  );
};
export default BathPage;
