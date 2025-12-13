export interface RideStatistics {
  totalRides: number;
  totalDistance: number;
  totalDuration: number;
  averageSpeed?: number;
  averageFuelEconomy?: number;
}

export class RideStatisticsResponseDto {
  totalRides: number;
  totalDistance: number;
  totalDuration: number;
  averageSpeed?: number;
  averageFuelEconomy?: number;

  constructor(statistics: RideStatistics) {
    this.totalRides = statistics.totalRides;
    this.totalDistance = statistics.totalDistance;
    this.totalDuration = statistics.totalDuration;
    this.averageSpeed = statistics.averageSpeed;
    this.averageFuelEconomy = statistics.averageFuelEconomy;
  }
}
