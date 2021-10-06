# Nodejs: Clusters and Paralelism

Node runs as single-threaded using concurrent processing by default, but can be configured to use parallelism with the Clusters module.


> # How it works

> The worker processes are spawned using the child_process.fork() method, so that they can communicate with the parent via IPC and pass server handles back and forth.

> The cluster module supports two methods of distributing incoming connections.

> The first one (and the default one on all platforms except Windows), is the round-robin approach, where the primary process listens on a port, accepts new connections and distributes them across the workers in a round-robin fashion, with some built-in smarts to avoid overloading a worker process.

> The second approach is where the primary process creates the listen socket and sends it to interested workers. The workers then accept incoming connections directly.

> The second approach should, in theory, give the best performance. In practice however, distribution tends to be very unbalanced due to operating system scheduler vagaries. Loads have been observed where over 70% of all connections ended up in just two processes, out of a total of eight.

To know more, please read (https://nodejs.org/api/cluster.html#cluster_how_it_works)


## Test Scenario

- The tests were run using a processor that has 4 cores and 4 Threads.
- **No Cluster** - uses only the default NodeJS configuration (concurrent)
- **With Cluster** - uses 4 forks (workers)
- Tested Function

```javascript
app.get('/', (req, res, next) => {
  // e7 = 7 zeros
  for (let i = 0; i < 3e7; i++) {
    for (let j = 0; j < 5; j++) { }
  }
  res.send('Hi there! Process completed.');
});
```

#### Benchmark

Configuration

- Concurrency (50) - Its the average number of simultaneous requests.
- Time (20) - Time in seconds 

Commands:

- Siege
`.\siege -c50 -t20s  http://localhost:5051/`

- ab Apache
`ab -c 50 -t 20 "http://localhost:5051/"`
 
Benchmarking tools:

- [Siege for windows](https://github.com/ewwink/siege-windows) 

    Usage
  1. Extract the content to C:\siege-windows
  2. Open a command prompt (or vscode terminal), go to C:\siege-windows and run it.

- [ab - Apache HTTP server benchmarking tool](https://httpd.apache.org/docs/current/programs/ab.html) - download at (http://httpd.apache.org/docs/current/platform/windows.html#down)

    Usage
  1. Extract the content and copy the /bin/ab.exe to a folder of your choice (ex: C:\Users\Username_Here)
  2. Start a command prompt and run it (wont work on vscode powershell terminal ). 

**More about Benchmarking:**

- (https://nodejs.org/en/docs/guides/simple-profiling/)
- Another Benchmarking tool (https://www.npmjs.com/package/autocannon)

## Test Results

For this scenario, the tests **With Cluster** were about 3x faster, an average of (34,5 transactions/sec) against (11,7 transactions/sec) of the tests **No Cluster**.

### No Cluster

`no-cluster.js`

- Siege

![siege-no-cluster](/docs/siege-no-cluster.jpg)

- Ab Apache

![ab-no-cluster](/docs/ab-no-cluster.jpg)


### **With Cluster**

`with-cluster.js`

- Siege

![siege-with-cluster](/docs/siege-with-cluster.jpg)

- Ab Apache

![ab-with-cluster](/docs/ab-with-cluster.jpg)

### **Points of Attention**

- Configuring the server to use more clusters than cores made the performance drop a lot, run some tests to see whats the best number of clusters for you. In my case, its was the same number of physical cores. 

