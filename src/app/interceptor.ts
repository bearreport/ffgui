import { Injectable } from "@angular/core";
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpResponse,
} from "@angular/common/http";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
    private cache: Map<string, any> = new Map();

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (request.method !== "GET") {
            // Only handle GET requests
            return next.handle(request);
        }

        const cachedResponse = this.cache.get(request.urlWithParams);
        if (cachedResponse) {
            // Serve the cached response if available
            return of(cachedResponse);
        }

        return next.handle(request).pipe(
            tap((event) => {
                if (event instanceof HttpResponse && event.status === 200) {
                    // Cache successful GET responses
                    this.cache.set(request.urlWithParams, event);
                }
            })
        );
    }
}
