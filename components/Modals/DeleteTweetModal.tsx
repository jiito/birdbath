import { Button } from "components/Button";
import React from "react";
import { ModalProps } from ".";

interface DeleteTweetModalProps extends ModalProps {
  data: {
    tweetCount: number;
  };
  onApprove: () => void;
}

export const DeleteTweetModal: React.FC<DeleteTweetModalProps> = ({
  data,
  isOpen,
  hideModal,
  onApprove,
}) => {
  if (!isOpen) {
    return <></>;
  }

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black/40">
      <div className="fixed rounded px-8 py-4 transform -translate-x-1/2 -translate-y-1/2 opacity-[1] top-1/2 left-1/2 bg-gray-50">
        <div>
          <h1 className="mb-8 text-lg font-bold border-b border-blue-300 ">
            Are you sure?
          </h1>
        </div>
        <div className="flex flex-col space-y-4">
          <p>You are about to delete {data.tweetCount} tweets.</p>
          <p>Are you sure you want to proceed?</p>
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <Button styleType="secondary" onClick={() => hideModal()}>
            No
          </Button>
          <Button onClick={() => onApprove()}>Yes</Button>
        </div>
      </div>
    </div>
  );
};
