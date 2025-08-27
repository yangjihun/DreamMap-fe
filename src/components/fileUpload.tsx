import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Upload,
  File as FileIcon,
  X,
} from "lucide-react";

interface FileUploadProps {
  selectedFile: File | null;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileRemove: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ selectedFile, onFileSelect, onFileRemove }) => {
    return (
        <div className="mt-6 space-y-6">
            <div>
                <Label className="text-base font-medium text-gray-700 mb-3 block">
                이력서 파일 선택
                </Label>
                <div className="mt-2">
                {selectedFile ? (
                    <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <FileIcon className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">
                        {selectedFile.name}
                        </span>
                        <span className="text-xs text-blue-600">
                        ({(selectedFile.size / 1024).toFixed(1)} KB)
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onFileRemove}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                    </div>
                ) : (
                    <div className="flex justify-center px-6 pt-8 pb-8 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
                    <div className="space-y-4 text-center">
                        <Upload className="mx-auto h-16 w-16 text-gray-400" />
                        <div className="space-y-2">
                        <Label className="relative cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 inline-block">
                            <span className="flex items-center">
                            <FileIcon className="h-4 w-4 mr-2" /> 파일
                            업로드
                            </span>
                            <Input
                            type="file"
                            className="sr-only"
                            accept=".pdf"
                            onChange={onFileSelect}
                            />
                        </Label>
                        </div>
                        <p className="text-xs text-gray-500">
                        PDF 파일만 지원합니다
                        </p>
                    </div>
                    </div>
                )}
                </div>
            </div>
            </div>
    );
};

export default FileUpload;