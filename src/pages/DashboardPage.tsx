import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import Header from "../components/ui/header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { FileText, MoreVertical, Star, Trash2, Eye } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import {
  deleteResume,
  toggleStar,
  fetchResumes,
} from "../redux/slices/resumeSlice";
import { useEffect } from "react";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const templates = [
  {
    id: "blank",
    title: "빈 이력서",
    description: "처음부터 시작하기",
    icon: FileText,
    color: "bg-blue-50 text-blue-600",
  },
];

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { resumes, loading, error } = useAppSelector((state) => state.resume);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const name = params.get("name") || undefined;
    dispatch(fetchResumes({ name }));
  }, [location.search, dispatch]);

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error, dispatch]);

  const handleStarToggle = (id: string) => {
    dispatch(toggleStar(id));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("정말로 이 이력서를 삭제하시겠습니까?")) {
      dispatch(deleteResume(id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <section className="mb-12">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            새 이력서 시작하기
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {templates.map((template) => (
              <Link
                key={template.id}
                to={
                  template.id === "1" ? "/upload?mode=new" : "/upload?mode=add"
                }
              >
                <Card className="border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group bg-white">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${template.color}`}
                    >
                      <template.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      {template.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {template.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">이력서 목록</h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">
                이력서 목록을 불러오고 있습니다...
              </p>
            </div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                아직 이력서가 없습니다
              </h3>
              <p className="text-gray-500 mb-6">
                위의 템플릿을 선택하여 첫 번째 이력서를 만들어보세요
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {resumes.map((resume) => (
                <Card
                  key={resume.id}
                  className="border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group bg-white"
                  onClick={() => navigate(`/resume/${resume.id}`)}
                >
                  <CardContent className="p-0">
                    <div className="h-48 bg-gray-50 border-b border-gray-200 flex items-center justify-center">
                      <div className="w-32 h-40 bg-white border border-gray-200 rounded shadow-sm flex items-center justify-center">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900 truncate flex-1 mr-2">
                          {resume.title}
                        </h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-100 group-hover:opacity-100 transition-opacity"
                              disabled={loading}
                              onClick={(e) => e.stopPropagation()}
                              onMouseDown={(e) => e.stopPropagation()}
                              onPointerDown={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-white z-50"
                          >
                            <DropdownMenuItem
                              onClick={() => navigate(`/resume/${resume.id}`)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>보기</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(resume.id);
                              }}
                              disabled={loading}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>삭제</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2"></div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStarToggle(resume.id);
                          }}
                          className="h-6 w-6 p-0"
                          disabled={loading}
                        >
                          <Star
                            className={`h-4 w-4 ${
                              resume.starred
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-400"
                            }`}
                          />
                        </Button>
                      </div>

                      <p className="text-xs text-gray-500 mt-2">
                        {formatDate(resume.updatedAt)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
