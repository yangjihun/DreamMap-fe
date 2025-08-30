import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Sparkles, Search, User, LogOut, List } from "lucide-react";
import { Avatar, AvatarFallback } from "./avatar";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout } from "../../redux/slices/authSlice";
import {
  createSearchParams,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

export default function Header() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();
  const isDashboardPage = location.pathname === "/dashboard";
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const goToWithQuery = (params: any = {}) => {
    navigate({
      pathname: "/dashboard",
      search: `?${createSearchParams(params)}`,
    });
  };

  const onCheckEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const value = (event.target as HTMLInputElement).value.trim();
      if (!value) return navigate("/dashboard");
      goToWithQuery({ name: value });
    }
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center space-x-3"
            onClick={() => navigate("/")}
          >
            <Sparkles className="h-7 w-7 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">미래지도</h1>
          </div>

          <div className="flex items-center space-x-4">
            {isDashboardPage && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="이력서 검색"
                  onKeyDown={onCheckEnter}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                    style={{ width: "auto" }}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-600 text-white text-sm">
                        {user?.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>{user.name} 님</div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-white/50 backdrop-blur-sm rounded-xl shadow-xl border-0 z-999"
                  align="end"
                  style={{ zIndex: 999 }}
                >
                  <div className="flex items-center justify-start gap-3 p-4">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="w-[200px] truncate text-sm text-gray-600">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-4" />
                  {/* <DropdownMenuItem className="px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-200 cursor-pointer rounded-lg mx-2 my-1">
                      <User className="mr-3 h-4 w-4 text-gray-500" />
                      <span>프로필</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-200 cursor-pointer rounded-lg mx-2 my-1">
                      <Settings className="mr-3 h-4 w-4 text-gray-500" />
                      <span>설정</span>
                    </DropdownMenuItem> */}
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-4" />
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 cursor-pointer rounded-lg mx-2 my-1"
                  >
                    <List className="mr-3 h-4 w-4 text-gray-500" />
                    <span>이력서 관리</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-200 cursor-pointer rounded-lg mx-2 my-1"
                  >
                    <LogOut className="mr-3 h-4 w-4 text-gray-500" />
                    <span>로그아웃</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <User className="h-4 w-4 mr-2" />
                  로그인
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
