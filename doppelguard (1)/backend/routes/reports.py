"""
Reports and historical audit logs API endpoints.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import ProfileAnalysisRecord, ProfileAnalysisResponse

router = APIRouter(prefix="/reports", tags=["Reports & History"])

@router.get("", response_model=List[ProfileAnalysisResponse])
def get_reports(
    limit: int = Query(50, ge=1, le=200),
    band: Optional[str] = Query(None, description="Filter by risk band LOW, MEDIUM, HIGH, CRITICAL"),
    threat_type: Optional[str] = Query(None, description="Filter by threat type"),
    search: Optional[str] = Query(None, description="Filter by username or target"),
    db: Session = Depends(get_db)
):
    """
    Retrieves stored profile impersonation risk reports from the database,
    ordered by most recent first. Supports filtering by risk band, threat type, or query.
    """
    query = db.query(ProfileAnalysisRecord)

    if band:
        query = query.filter(ProfileAnalysisRecord.risk_band == band.upper())
    if threat_type:
        query = query.filter(ProfileAnalysisRecord.threat_type == threat_type)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (ProfileAnalysisRecord.username.ilike(search_pattern)) |
            (ProfileAnalysisRecord.name.ilike(search_pattern)) |
            (ProfileAnalysisRecord.likely_target.ilike(search_pattern))
        )

    records = query.order_by(ProfileAnalysisRecord.created_at.desc()).limit(limit).all()
    return [rec.to_dict() for rec in records]

@router.delete("/{report_id}")
def delete_report(report_id: int, db: Session = Depends(get_db)):
    """Deletes an analysis report by ID."""
    record = db.query(ProfileAnalysisRecord).filter(ProfileAnalysisRecord.id == report_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Report not found")
    
    db.delete(record)
    db.commit()
    return {"status": "deleted", "id": report_id}
