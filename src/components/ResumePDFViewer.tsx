import {
  Page,
  Text,
  Document,
  StyleSheet,
  View,
  PDFViewer,
} from "@react-pdf/renderer";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MessageSquare } from "lucide-react";
import { Resume, ResumeItem, ResumeSession } from "@/types/resume";

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  session: {
    marginBottom: 16,
  },
  sessionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 6,
  },
  item: {
    marginBottom: 6,
  },
  itemTitle: {
    fontSize: 11.5,
    fontWeight: "bold",
  },
  itemText: {
    fontSize: 10.5,
    marginLeft: 8,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#000", // 얇은 solid 라인
    marginVertical: 10,
  },
});

export const ResumePDFViewer = ({ resume }: { resume: Resume }) => {
  console.log("resume>>>>>>>>", resume);
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI 분석 이력서 미리보기
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* pdf 문서 */}
          <div style={{ height: 600 }}>
            <PDFViewer style={{ width: "100%", height: "100%" }} showToolbar>
              <Document>
                <Page size="A4" style={styles.page}>
                  <View style={styles.title}>
                    <Text style={styles.title}>{resume.title}</Text>
                  </View>
                  {resume.sessions.map(
                    (session: ResumeSession, sIdx: number) => (
                      <View key={sIdx} style={styles.session}>
                        <Text style={styles.sessionTitle}>{session.title}</Text>
                        <View style={styles.divider} />
                        {session.items.map((item: ResumeItem, iIdx: number) => (
                          <View key={iIdx} style={styles.item}>
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            <Text style={styles.itemText}>{item.text}</Text>
                          </View>
                        ))}
                      </View>
                    )
                  )}
                </Page>
              </Document>
            </PDFViewer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
