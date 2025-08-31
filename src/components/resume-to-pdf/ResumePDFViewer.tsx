import {
  Page,
  Text,
  Document,
  StyleSheet,
  View,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";
import { Resume, ResumeItem, ResumeSession } from "@/types/resume";

Font.register({
  family: "NotoSansKR",
  fonts: [
    {
      src: "/fonts/NotoSansKR-Regular.ttf",
      fontWeight: "normal",
    },
    {
      src: "/fonts/NotoSansKR-SemiBold.ttf",
      fontWeight: "semibold",
    },
    {
      src: "/fonts/NotoSansKR-Bold.ttf",
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 12,
    fontFamily: "NotoSansKR",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  personalInfo: {
    marginBottom: 16,
    textAlign: "center",
  },
  personalInfoText: {
    fontSize: 11,
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
  itemMeta: {
    fontSize: 9,
    marginLeft: 8,
    color: "#6B7280",
    marginBottom: 2,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#000", // 얇은 solid 라인
    marginVertical: 10,
  },
});

export const ResumePDFViewer = ({ resume }: { resume: Resume }) => {
  return (
    <div style={{ height: 600 }}>
      <PDFViewer style={{ width: "100%", height: "100%" }}>
        <ResumeDocument resume={resume} />
      </PDFViewer>
    </div>
  );
};

export const ResumeDocument = ({ resume }: { resume: Resume }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.name}>
          <Text style={styles.name}>{resume.title}</Text>
        </View>

        {/* Handle Personal Information section specially */}
        {resume.sessions.map((session: ResumeSession, sIdx: number) => {
          if (session.title === "개인정보") {
            // Personal Information: display items directly under title without session header
            return (
              <View key="personal-info" style={styles.personalInfo}>
                <Text style={styles.personalInfoText}>
                  {session.items.map((item: ResumeItem, iIdx: number) => (
                    <>
                      {item.text}
                      {iIdx < session.items.length - 1 && " | "}
                    </>
                  ))}
                </Text>
              </View>
            );
          } else if (session.title === "Skills") {
            // Skills section with "Name: Text" format
            return (
              <View key={sIdx} style={styles.session}>
                <Text style={styles.sessionTitle}>{session.title}</Text>
                <View style={styles.divider} />
                {session.items.map((item: ResumeItem, iIdx: number) => (
                  <View key={iIdx} style={styles.item}>
                    <Text style={styles.itemText}>
                      {item.title && `${item.title}: `}
                      {item.text}
                    </Text>
                  </View>
                ))}
              </View>
            );
          } else {
            // Regular sections with normal structure
            return (
              <View key={sIdx} style={styles.session}>
                <Text style={styles.sessionTitle}>{session.title}</Text>
                <View style={styles.divider} />
                {session.items.map((item: ResumeItem, iIdx: number) => (
                  <View key={iIdx} style={styles.item}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    {item.companyAddress && (
                      <Text style={styles.itemMeta}>
                        {item.companyAddress}
                        {item.startDate && (
                          <>
                            {" | "}
                            {item.startDate}
                            {item.endDate &&
                              item.startDate !== item.endDate && (
                                <> ~ {item.endDate}</>
                              )}
                          </>
                        )}
                      </Text>
                    )}
                    {!item.companyAddress && item.startDate && (
                      <Text style={styles.itemMeta}>
                        {item.startDate}
                        {item.endDate && item.startDate !== item.endDate && (
                          <> ~ {item.endDate}</>
                        )}
                      </Text>
                    )}
                    <Text style={styles.itemText}>{item.text}</Text>
                  </View>
                ))}
              </View>
            );
          }
        })}
      </Page>
    </Document>
  );
};
