import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  FileText,
  MoreVertical,
  User,
  Settings,
  LogOut,
  Sparkles,
  Star,
  Trash2,
  Eye,
  Search,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { deleteResume, toggleStar, fetchResumes, setError } from "../redux/slices/resumeSlice";
import { logout } from "../redux/slices/authSlice";
import { useEffect } from "react";

const templates = [
  {
    id: "blank",
    title: "빈 레쥬메",
    description: "처음부터 시작하기",
    icon: FileText,
    color: "bg-blue-50 text-blue-600",
  }
];

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { resumes, loading, error } = useAppSelector((state) => state.resume);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchResumes());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(setError(error));
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

  const handleLogout = () => {
    dispatch(logout());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "text-muted-foreground";
      case "analyzed":
        return "text-blue-600";
      case "completed":
        return "text-green-600";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "draft":
        return "작성 중";
      case "analyzed":
        return "분석 완료";
      case "completed":
        return "완성됨";
      default:
        return "알 수 없음";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles className="h-7 w-7 text-blue-600" />
              <h1 className="text-xl font-medium text-gray-900">ResumeAI</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="레쥬메 검색"
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-600 text-white text-sm">
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-gray-900">{user?.name}</p>
                      <p className="w-[200px] truncate text-sm text-gray-500">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>프로필</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>설정</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>로그아웃</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <section className="mb-12">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            새 레쥬메 시작하기
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {templates.map((template) => (
              <Link 
                key={template.id} 
                to={template.id === "1" ? "/upload?mode=new" : "/upload?mode=add"}
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
            <h2 className="text-lg font-medium text-gray-900">최근 레쥬메</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
            >
              모두 보기
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">이력서 목록을 불러오고 있습니다...</p>
            </div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                아직 레쥬메가 없습니다
              </h3>
              <p className="text-gray-500 mb-6">
                위의 템플릿을 선택하여 첫 번째 레쥬메를 만들어보세요
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
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              disabled={loading}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white">
                            <DropdownMenuItem onClick={() => navigate(`/resume/${resume.id}`)}>
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
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                              resume.status
                            )} bg-gray-100`}
                          >
                            {getStatusText(resume.status)}
                          </span>
                        </div>
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
                        {resume.lastModified}
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