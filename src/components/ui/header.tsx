import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Sparkles, Search, User, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "./avatar";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout } from "../../redux/slices/authSlice";
import { useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();
  const isDashboardPage = location.pathname === "/dashboard";
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout());
    navigate("/")
  };
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3" onClick={()=>navigate("/")}>
            <Sparkles className="h-7 w-7 text-blue-600" />
            <h1 className="text-xl font-medium text-gray-900">미래지도</h1>
          </div>

          <div className="flex items-center space-x-4">
            {isDashboardPage && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="레쥬메 검색"
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full "
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-600 text-white text-sm">
                        {user?.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-white/50 backdrop-blur-sm rounded-xl shadow-xl border-0"
                  align="end"
                >
                  <div className="flex items-center justify-start gap-3 p-4">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-gray-800">{user?.name}</p>
                      <p className="w-[200px] truncate text-sm text-gray-600">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-4" />
                  {/*<DropdownMenuItem className="px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-200 cursor-pointer rounded-lg mx-2 my-1">
                    <User className="mr-3 h-4 w-4 text-gray-500" />
                    <span>프로필</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-200 cursor-pointer rounded-lg mx-2 my-1">
                    <Settings className="mr-3 h-4 w-4 text-gray-500" />
                    <span>설정</span>
                  </DropdownMenuItem>*/}
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-4" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-200 cursor-pointer rounded-lg mx-2 my-1"
                  >
                    <LogOut className="mr-3 h-4 w-4 text-gray-500" />
                    <span>로그아웃</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="text-sm text-gray-500">Loading...</div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
