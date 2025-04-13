/**
 * /////////////////////////////////////////////////////////////////////////////
 * //                                                                         //
 * //  [FEVERDUCATION] - AI Insights API Route                                //
 * //  ---------------------------------------------------------------        //
 * //  This route provides AI-generated insights on student performance        //
 * //  and teaching effectiveness by analyzing data from the database.        //
 * //                                                                         //
 * //  CODEX LEVEL: ALPHA-7                                                   //
 * //  VERSION: 1.0.0                                                         //
 * //  PLATFORM: CROSS-COMPATIBLE (WIN/LINUX)                                 //
 * //                                                                         //
 * /////////////////////////////////////////////////////////////////////////////
 */

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface InsightRequest {
  teacherId: string;
  timeframe?: "week" | "month" | "quarter" | "year";
  types?: Array<"performance" | "engagement" | "attendance" | "improvement">;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json() as InsightRequest;
    
    // Validate required fields
    if (!body.teacherId) {
      return NextResponse.json(
        { error: "Teacher ID is required" },
        { status: 400 }
      );
    }
    
    // Set defaults
    const timeframe = body.timeframe || "month";
    const types = body.types || ["performance", "engagement", "attendance", "improvement"];
    
    // Get teacher data
    const teacher = await prisma.teacher.findUnique({
      where: { id: body.teacherId },
      include: {
        classes: {
          include: {
            students: {
              include: {
                attendances: true,
                grades: true,
                activities: true
              }
            }
          }
        }
      }
    });
    
    if (!teacher) {
      return NextResponse.json(
        { error: "Teacher not found" },
        { status: 404 }
      );
    }
    
    // Prepare data points for AI analysis
    const dataPoints = await prepareDataPoints(teacher, timeframe, types);
    
    // Call the Python AI backend service
    const aiResponse = await fetch("http://localhost:8000/api/insights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teacher: {
          id: teacher.id,
          name: teacher.name
        },
        timeframe,
        types,
        dataPoints
      }),
    });
    
    if (!aiResponse.ok) {
      const errorData = await aiResponse.json();
      throw new Error(`AI service error: ${errorData.error || aiResponse.statusText}`);
    }
    
    const data = await aiResponse.json();
    
    return NextResponse.json({
      insights: data.insights,
      metadata: {
        teacherId: body.teacherId,
        timeframe,
        types,
        generatedAt: new Date().toISOString(),
      }
    });
    
  } catch (error) {
    console.error("Error in AI insights route:", error);
    
    // If it's a fetch error (AI service not available), try to use mock insights
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { 
          error: "AI service is currently unavailable",
          fallback: true,
          insights: generateMockInsights()
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * Prepare data points for AI analysis from the teacher's data
 */
async function prepareDataPoints(teacher: any, timeframe: string, types: string[]) {
  // This would normally extract and format data from the database
  // For now, we'll return a simplified structure
  
  return {
    classes: teacher.classes.map((cls: any) => ({
      id: cls.id,
      name: cls.name,
      subject: cls.subject,
      students: cls.students.length,
      averageGrade: calculateAverageGrade(cls.students),
      attendanceRate: calculateAttendanceRate(cls.students),
      engagementMetrics: calculateEngagementMetrics(cls.students)
    }))
  };
}

/**
 * Calculate average grade across all students
 */
function calculateAverageGrade(students: any[]) {
  if (!students.length) return 0;
  
  const totalGrades = students.reduce((sum, student) => {
    const studentAvg = student.grades.length 
      ? student.grades.reduce((s: number, g: any) => s + g.score, 0) / student.grades.length
      : 0;
    return sum + studentAvg;
  }, 0);
  
  return students.length ? totalGrades / students.length : 0;
}

/**
 * Calculate attendance rate across all students
 */
function calculateAttendanceRate(students: any[]) {
  if (!students.length) return 0;
  
  const attendanceRates = students.map(student => {
    if (!student.attendances.length) return 0;
    const present = student.attendances.filter((a: any) => a.status === 'PRESENT').length;
    return present / student.attendances.length;
  });
  
  return attendanceRates.reduce((sum, rate) => sum + rate, 0) / attendanceRates.length;
}

/**
 * Calculate engagement metrics across all students
 */
function calculateEngagementMetrics(students: any[]) {
  // This would analyze activity data, classroom participation, etc.
  // For now, return a simplified random metric
  return {
    participation: Math.random() * 100,
    questionAsking: Math.random() * 100,
    homeworkCompletion: Math.random() * 100,
  };
}

/**
 * Generate mock insights when AI service is unavailable
 */
function generateMockInsights() {
  return [
    {
      type: "warning",
      title: "Declining Participation in Chemistry",
      description:
        "Student participation in Chemistry classes has decreased by 15% over the last month. This correlates with the introduction of the new Periodic Table unit.",
      metric: {
        label: "Participation Rate",
        value: "76%",
        trend: "down",
        change: "-15%",
      },
      action: {
        label: "View Detailed Report",
        actionType: "REPORT",
        targetId: "chemistry-participation"
      },
    },
    {
      type: "success",
      title: "Biology Performance Improving",
      description:
        "The interactive lessons on Photosynthesis have resulted in a 12% increase in test scores. Consider applying similar teaching methods to other subjects.",
      metric: {
        label: "Average Score",
        value: "85%",
        trend: "up",
        change: "+12%",
      },
      action: {
        label: "See Teaching Methods",
        actionType: "METHODS",
        targetId: "biology-methods"
      },
    },
    {
      type: "info",
      title: "Student Engagement Pattern",
      description:
        "Data shows higher engagement in morning classes (before 11 AM) compared to afternoon sessions. Consider scheduling more challenging topics earlier in the day.",
      metric: {
        label: "Morning Engagement",
        value: "92%",
        trend: "up",
        change: "+18% vs afternoon",
      },
      action: {
        label: "View Schedule Analysis",
        actionType: "ANALYSIS",
        targetId: "schedule-analysis"
      },
    },
    {
      type: "warning",
      title: "At-Risk Students Identified",
      description:
        "7 students are showing signs of falling behind, particularly in Mathematics. Early intervention is recommended.",
      metric: {
        label: "At-Risk Students",
        value: "7",
        trend: "up",
        change: "+3 from last month",
      },
      action: {
        label: "View Student List",
        actionType: "STUDENTS",
        targetId: "at-risk-students"
      },
    },
  ];
}
