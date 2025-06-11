// components/main/DocumentCard.jsx
import { Link } from "react-router-dom";
import {
  FileText,
  MoreVertical,
  Star,
  Trash2,
  Share2,
  Download,
  Calendar,
  MessageSquare,
  FileIcon,
} from "lucide-react";
import { useState } from "react";
import { dateUtils, fileUtils } from "../../utils/helper.js";
import { useDocuments } from "../../hooks/useDocuments.js";
import Card from "../ui/Card.jsx";
import Badge from "../ui/Badge.jsx";

const DocumentCard = ({ document }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { deleteDocument, updateDocument } = useDocuments();

  const handleStarToggle = async () => {
    const newStatus = document.status === "STARRED" ? "NONE" : "STARRED";
    try {
      await updateDocument({
        documentId: document.id,
        updates: { status: newStatus },
      });
    } catch (error) {
      console.error("Failed to update document status:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await deleteDocument(document.id);
      } catch (error) {
        console.error("Failed to delete document:", error);
      }
    }
  };

  const getStatusBadge = () => {
    switch (document.state) {
      case "UPLOAD":
        return <Badge variant="warning">Upload</Badge>;
      case "CHAT":
        return <Badge variant="success">Analyzed</Badge>;
      case "VISUALIZE":
        return <Badge variant="primary">Visualized</Badge>;
      default:
        return <Badge variant="default">Ready</Badge>;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <Card.Content className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <Link
                to={`/analyze/${document.id}`}
                className="block text-sm font-medium text-gray-900 hover:text-blue-600 truncate"
              >
                {document.name}
              </Link>
              <div className="flex items-center space-x-2 mt-1">
                {getStatusBadge()}
                {document.status === "STARRED" && (
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                )}
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={handleStarToggle}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Star className="w-4 h-4 mr-3" />
                    {document.status === "STARRED" ? "Unstar" : "Star"}
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Share2 className="w-4 h-4 mr-3" />
                    Share
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Download className="w-4 h-4 mr-3" />
                    Download
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={handleDelete}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-3" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Document stats */}
        <div className="grid grid-cols-3 gap-3 mb-3 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <FileIcon className="w-3 h-3" />
            <span>
              {document.documentCount} doc
              {document.documentCount !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageSquare className="w-3 h-3" />
            <span>
              {document.messageCount} quer
              {document.messageCount !== 1 ? "ies" : "y"}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{dateUtils.getRelativeTime(document.updatedAt)}</span>
          </div>
        </div>

        {/* Last message preview */}
        {document.lastMessage && (
          <div className="bg-gray-50 rounded-lg p-2 mb-3">
            <p className="text-xs text-gray-600 line-clamp-2">
              {document.lastMessage}
            </p>
          </div>
        )}

        {/* Documents list */}
        {document.documents && document.documents.length > 0 && (
          <div className="space-y-1">
            {document.documents.slice(0, 2).map((doc) => (
              <div
                key={doc.id}
                className="flex items-center space-x-2 text-xs text-gray-500"
              >
                <div className="w-3 h-3 bg-gray-300 rounded"></div>
                <span className="truncate">{doc.name}</span>
              </div>
            ))}
            {document.documents.length > 2 && (
              <div className="text-xs text-gray-400">
                +{document.documents.length - 2} more files
              </div>
            )}
          </div>
        )}
      </Card.Content>

      <Card.Footer className="px-4 py-3 bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Updated {dateUtils.formatDate(document.updatedAt)}
          </span>
          <Link
            to={`/analyze/${document.id}`}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            {document.state === "CHAT" ? "Continue Chat" : "Analyze"}
          </Link>
        </div>
      </Card.Footer>

      {/* Click outside handler */}
      {showMenu && (
        <div className="fixed inset-0 z-0" onClick={() => setShowMenu(false)} />
      )}
    </Card>
  );
};

export default DocumentCard;
